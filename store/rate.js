import { defineStore } from 'pinia'
import { fetchExchangeRates } from '@/api/exchange'
import defaultRatesData from '@/data/default-rates.js'

export const useRateStore = defineStore('rate', {
	state: () => ({
		// 汇率数据对象 { 'CNY': 7.0245, 'EUR': 0.9302, ... }
		rates: {},
		
		// 基准货币
		base: 'USD',
		
		// 最后更新时间戳
		lastUpdate: null,
		
		// 加载状态
		isLoading: false,
		
		// 离线模式标识
		isOffline: false
	}),
	
	getters: {
		// 获取两个币种之间的汇率
		getRate: (state) => (from, to) => {
			if (from === to) return 1
			
			if (!state.rates || typeof state.rates !== 'object') return 1
			
			const fromRate = state.rates[from] || 1
			const toRate = state.rates[to] || 1
			
			// 通过基准货币转换
			return toRate / fromRate
		},
		
		// 更新时间描述
		updateTimeDesc: (state) => {
			if (!state.lastUpdate) return '未更新'
			
			const now = Date.now()
			const diff = now - state.lastUpdate
			const minutes = Math.floor(diff / 60000)
			
			if (minutes < 1) return '刚刚'
			if (minutes < 60) return `${minutes} 分钟前`
			
			const hours = Math.floor(minutes / 60)
			if (hours < 24) return `${hours} 小时前`
			
			const days = Math.floor(hours / 24)
			return `${days} 天前`
		},
		
		// 是否有汇率数据
		hasRates: (state) => {
			// 增加空值检查
			if (!state.rates || typeof state.rates !== 'object') {
				return false
			}
			return Object.keys(state.rates).length > 0
		}
	},
	
	actions: {
		// 获取汇率数据
		async fetchRates(base = 'USD') {
			this.isLoading = true
			console.log('🔄 fetchRates 开始, 基准货币:', base)
			
			try {
				const data = await fetchExchangeRates(base)
				console.log('📊 获取到的汇率数据:', data)
				
				this.rates = data.rates
				this.base = data.base
				// 使用API返回的时间戳
				this.lastUpdate = data.timestamp
				this.isOffline = false
				
				// 保存到本地
				this.saveToStorage()
				
				console.log('✅ 汇率数据获取成功')
				console.log('  - 汇率数量:', Object.keys(this.rates).length)
				console.log('  - 更新时间:', new Date(this.lastUpdate).toLocaleString())
				return true
			} catch (error) {
				console.warn('⚠️ 在线获取汇率失败，使用离线数据:', error.message)
				console.error('错误堆栈:', error.stack)
				
				// 先尝试使用缓存数据
				const hasCached = this.loadFromStorage()
				
				if (!hasCached || !this.hasRates) {
					// 如果没有缓存，使用默认汇率
					console.log('📦 加载内置默认汇率数据')
					await this.loadDefaultRates()
				}
				
				this.isOffline = true
				return false
			} finally {
				this.isLoading = false
			}
		},
		
	// 加载默认汇率（内置数据）
	loadDefaultRates() {
		try {
			console.log('📦 加载默认汇率数据')
			
			this.rates = defaultRatesData.rates
			this.base = defaultRatesData.base
			this.lastUpdate = defaultRatesData.timestamp // 已经是毫秒
			this.isOffline = true
			
			console.log('✅ 默认汇率加载成功:')
			console.log('  - 基准货币:', this.base)
			console.log('  - 汇率数量:', Object.keys(this.rates).length)
			console.log('  - 前5个币种:', Object.keys(this.rates).slice(0, 5))
		} catch (error) {
			console.error('❌ 加载默认汇率失败:', error)
			console.error('❌ 错误详情:', error.stack)
		}
	},
		
		// 保存到本地存储
		saveToStorage() {
			try {
				uni.setStorageSync('exchangeRates', this.rates)
				uni.setStorageSync('ratesBase', this.base)
				uni.setStorageSync('ratesLastUpdate', this.lastUpdate)
			} catch (error) {
				console.error('保存汇率数据失败:', error)
			}
		},
		
		// 从本地存储加载
		loadFromStorage() {
			try {
				const rates = uni.getStorageSync('exchangeRates')
				const base = uni.getStorageSync('ratesBase')
				const lastUpdate = uni.getStorageSync('ratesLastUpdate')
				
				if (rates && Object.keys(rates).length > 0) {
					this.rates = rates
					this.base = base || 'USD'
					this.lastUpdate = lastUpdate
					console.log('💾 本地缓存加载成功，汇率数量:', Object.keys(rates).length)
					return true
				} else {
					console.log('📭 本地无缓存数据')
					return false
				}
			} catch (error) {
				console.error('❌ 加载本地数据失败:', error)
				return false
			}
		}
	}
})

