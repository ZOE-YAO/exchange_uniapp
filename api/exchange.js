/**
 * 汇率 API 接口
 */
import { get } from './request'

// 根据环境选择 API 地址
// #ifdef H5
// H5 环境统一使用代理，避免 CORS 问题
const PRIMARY_API = '/api/v6/latest'
const FALLBACK_API = '/api/v4/latest'
// #endif

// #ifndef H5
// 非 H5 环境（App、小程序）可以直接访问
const PRIMARY_API = 'https://open.er-api.com/v6/latest'
const FALLBACK_API = 'https://api.exchangerate-api.com/v4/latest'
// #endif

/**
 * 获取汇率数据
 * @param {string} base - 基准货币代码，默认 USD
 * @returns {Promise<object>}
 */
export const fetchExchangeRates = async (base = 'USD') => {
	console.log('📡 开始获取汇率数据, 基准货币:', base)
	console.log('📡 API 地址:', `${PRIMARY_API}/${base}`)
	
	try {
		// 尝试主数据源
		const response = await get(`${PRIMARY_API}/${base}`)
		console.log('✅ 主数据源响应:', response)
		
		if (!response || !response.rates) {
			throw new Error('响应数据格式错误')
		}
		
		return {
			base: response.base_code || base,
			rates: response.rates,
			timestamp: response.time_last_update_unix * 1000 || Date.now()
		}
	} catch (error) {
		console.warn('⚠️ 主数据源失败:', error)
		console.warn('错误信息:', error.message || error.errMsg || '未知错误')
		
		try {
			// 尝试备用数据源
			console.log('📡 备用 API 地址:', `${FALLBACK_API}/${base}`)
			const response = await get(`${FALLBACK_API}/${base}`)
			console.log('✅ 备用数据源响应:', response)
			
			if (!response || !response.rates) {
				throw new Error('备用响应数据格式错误')
			}
			
			return {
				base: response.base || base,
				rates: response.rates,
				timestamp: response.time_last_updated * 1000 || Date.now()
			}
		} catch (fallbackError) {
			console.error('❌ 备用数据源也失败:', fallbackError)
			console.error('错误信息:', fallbackError.message || fallbackError.errMsg || '未知错误')
			
			// 抛出更详细的错误信息
			const errorMsg = fallbackError.message || fallbackError.errMsg || '网络请求失败'
			throw new Error('无法获取汇率数据: ' + errorMsg)
		}
	}
}

/**
 * 获取特定货币对的汇率
 * @param {string} from - 源货币
 * @param {string} to - 目标货币
 * @returns {Promise<number>}
 */
export const fetchPairRate = async (from, to) => {
	try {
		const data = await fetchExchangeRates(from)
		return data.rates[to] || null
	} catch (error) {
		console.error('获取货币对汇率失败:', error)
		throw error
	}
}

export default {
	fetchExchangeRates,
	fetchPairRate
}

