/**
 * 汇率计算工具类
 * 使用 big.js 进行精确计算
 */
import Big from 'big.js'

// 配置 Big.js
Big.DP = 20 // 设置小数位精度
Big.RM = Big.roundHalfUp // 四舍五入

/**
 * 汇率换算
 * @param {string|number} amount - 金额
 * @param {string} fromCode - 源币种代码
 * @param {string} toCode - 目标币种代码
 * @param {object} rates - 汇率数据对象
 * @returns {string} 换算后的金额
 */
export const convertCurrency = (amount, fromCode, toCode, rates) => {
	// 如果金额为空或0，返回空字符串
	if (!amount || amount === '0' || amount === '0.') return ''
	
	try {
		// 如果源币种和目标币种相同，直接返回
		if (fromCode === toCode) {
			return amount.toString()
		}
		
		// 创建 Big 对象
		const amountBig = new Big(amount)
		
		// 获取汇率（假设 rates 是以某个基准货币为基准的汇率对象）
		const fromRate = rates[fromCode]
		const toRate = rates[toCode]
		
		if (!fromRate || !toRate) {
			console.warn(`汇率数据不完整: ${fromCode} 或 ${toCode}`)
			return ''
		}
		
		// 换算公式: amount * (toRate / fromRate)
		// 先转换为基准货币，再转换为目标货币
		const result = amountBig.div(fromRate).times(toRate)
		
		return result.toString()
	} catch (error) {
		console.error('汇率计算错误:', error)
		return ''
	}
}

/**
 * 格式化金额显示
 * @param {string|number} amount - 金额
 * @param {number} decimalPlaces - 小数位数
 * @param {string} thousandSeparator - 千分位分隔符
 * @returns {string} 格式化后的金额
 */
export const formatAmount = (amount, decimalPlaces = 2, thousandSeparator = ',') => {
	if (!amount || amount === '' || amount === '0') return '0.00'
	
	try {
		const num = new Big(amount)
		
		// 保留指定小数位
		let formatted = num.toFixed(decimalPlaces)
		
		// 添加千分位分隔符
		if (thousandSeparator) {
			const parts = formatted.split('.')
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
			formatted = parts.join('.')
		}
		
		return formatted
	} catch (error) {
		console.error('格式化金额错误:', error)
		return '0.00'
	}
}

/**
 * 验证金额输入
 * @param {string} value - 输入值
 * @param {number} maxDecimal - 最大小数位数
 * @returns {boolean} 是否有效
 */
export const validateAmount = (value, maxDecimal = 8) => {
	if (!value) return true
	
	// 正则: 可选的数字开头，可选的小数点和小数部分
	const regex = new RegExp(`^\\d*\\.?\\d{0,${maxDecimal}}$`)
	return regex.test(value)
}

/**
 * 清理金额字符串（移除多余的0）
 * @param {string} value - 金额字符串
 * @returns {string} 清理后的金额
 */
export const cleanAmount = (value) => {
	if (!value) return ''
	
	try {
		// 移除前导0（除了 0.xxx 的情况）
		let cleaned = value.replace(/^0+(\d)/, '$1')
		
		// 如果只有小数点开头，补0
		if (cleaned.startsWith('.')) {
			cleaned = '0' + cleaned
		}
		
		return cleaned
	} catch (error) {
		return value
	}
}

/**
 * 批量换算
 * @param {string} amount - 源金额
 * @param {string} fromCode - 源币种
 * @param {array} toCodes - 目标币种列表
 * @param {object} rates - 汇率数据
 * @returns {object} { 'USD': '123.45', 'EUR': '110.20', ... }
 */
export const batchConvert = (amount, fromCode, toCodes, rates) => {
	const results = {}
	
	toCodes.forEach(toCode => {
		results[toCode] = convertCurrency(amount, fromCode, toCode, rates)
	})
	
	return results
}

