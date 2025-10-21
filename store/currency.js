import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
	state: () => ({
		// 用户选择的币种代码列表（按添加顺序）
		selectedCurrencies: ['CNY', 'USD'],
		
		// 各币种的金额
		amounts: {
			'CNY': '',
			'USD': ''
		},
		
		// 当前正在输入的币种（活跃币种）
		activeCurrency: '',
		
		// 最后一次输入的币种（用于保持置顶）
		lastInputCurrency: '',
		
		// 历史查询记录（最多10条）
		queryHistory: []
	}),
	
	getters: {
		// 获取已选币种数量
		selectedCount: (state) => state.selectedCurrencies.length,
		
		// 检查币种是否已选
		isSelected: (state) => (code) => {
			return state.selectedCurrencies.includes(code)
		},
		
		// 获取历史记录数量
		historyCount: (state) => state.queryHistory.length
	},
	
	actions: {
		// 添加币种
		addCurrency(code) {
			if (!this.selectedCurrencies.includes(code)) {
				this.selectedCurrencies.push(code)
				this.amounts[code] = ''
				this.saveToStorage()
			}
		},
		
		// 移除币种
		removeCurrency(code) {
			const index = this.selectedCurrencies.indexOf(code)
			if (index > -1) {
				this.selectedCurrencies.splice(index, 1)
				delete this.amounts[code]
				
				// 如果删除的是当前活跃币种，清空活跃状态
				if (this.activeCurrency === code) {
					this.activeCurrency = ''
				}
				
				this.saveToStorage()
			}
		},
		
		// 更新金额
		updateAmount(code, amount) {
			this.amounts[code] = amount
			this.activeCurrency = code
			// 记录最后输入的货币（用于保持置顶）
			if (amount && amount !== '0' && amount !== '') {
				this.lastInputCurrency = code
			}
		},
		
		// 清空所有金额
		clearAllAmounts() {
			Object.keys(this.amounts).forEach(key => {
				this.amounts[key] = ''
			})
			this.activeCurrency = ''
		},
		
		// 保存到本地存储
		saveToStorage() {
			try {
				uni.setStorageSync('selectedCurrencies', this.selectedCurrencies)
				uni.setStorageSync('currencyAmounts', this.amounts)
			} catch (error) {
				console.error('保存币种数据失败:', error)
			}
		},
		
		// 从本地存储加载
		loadFromStorage() {
			try {
				const currencies = uni.getStorageSync('selectedCurrencies')
				const amounts = uni.getStorageSync('currencyAmounts')
				const lastInput = uni.getStorageSync('lastInputCurrency')
				
				if (currencies && currencies.length > 0) {
					this.selectedCurrencies = currencies
				}
				
				if (amounts) {
					this.amounts = amounts
				}
				
				if (lastInput) {
					this.lastInputCurrency = lastInput
				}
				
				// 加载历史记录
				this.loadHistoryFromStorage()
			} catch (error) {
				console.error('加载币种数据失败:', error)
			}
		},
		
		// 设置最后输入的货币
		setLastInputCurrency(code) {
			this.lastInputCurrency = code
			try {
				uni.setStorageSync('lastInputCurrency', code)
			} catch (error) {
				console.error('保存最后输入货币失败:', error)
			}
		},
		
		// 添加查询历史记录（只记录与基准货币的兑换）
		addQueryHistory(fromCode, fromAmount, baseCode, rates) {
			// 只记录输入货币与基准货币的兑换关系
			if (fromCode === baseCode) return // 如果输入的就是基准货币，不记录
			
			const timestamp = Date.now()
			const fromRate = rates[fromCode] || 1
			const baseAmount = (parseFloat(fromAmount) / fromRate).toString()
			
			const record = {
				id: timestamp,
				fromCode,
				fromAmount: parseFloat(fromAmount).toString(),
				toCode: baseCode, 
				toAmount: baseAmount,
				timestamp
			}
			
			// 检查是否有相同的记录（相同的转换对和相似金额）
			const existingIndex = this.queryHistory.findIndex(item => 
				item.fromCode === fromCode && 
				item.toCode === baseCode && 
				Math.abs(parseFloat(item.fromAmount) - parseFloat(fromAmount)) < 0.01
			)
			
			if (existingIndex > -1) {
				// 如果已存在相似记录，更新时间戳并移到最前面
				this.queryHistory.splice(existingIndex, 1)
			}
			
			// 添加到最前面
			this.queryHistory.unshift(record)
			
			// 保持最多10条记录
			if (this.queryHistory.length > 10) {
				this.queryHistory = this.queryHistory.slice(0, 10)
			}
			
			this.saveHistoryToStorage()
		},
		
		// 清空查询历史
		clearQueryHistory() {
			this.queryHistory = []
			this.saveHistoryToStorage()
		},
		
		// 根据历史记录快速恢复查询
		restoreFromHistory(record) {
			// 确保两个币种都已选择
			if (!this.isSelected(record.fromCode)) {
				this.addCurrency(record.fromCode)
			}
			if (!this.isSelected(record.toCode)) {
				this.addCurrency(record.toCode)
			}
			
			// 恢复金额
			this.updateAmount(record.fromCode, record.fromAmount)
			
			// 触发重新计算其他币种
			return {
				targetCurrency: record.fromCode,
				amount: record.fromAmount
			}
		},
		
		// 保存历史记录到本地存储
		saveHistoryToStorage() {
			try {
				uni.setStorageSync('queryHistory', this.queryHistory)
			} catch (error) {
				console.error('保存查询历史失败:', error)
			}
		},
		
		// 从本地存储加载历史记录
		loadHistoryFromStorage() {
			try {
				const history = uni.getStorageSync('queryHistory')
				if (history && Array.isArray(history)) {
					this.queryHistory = history
				}
			} catch (error) {
				console.error('加载查询历史失败:', error)
			}
		}
	}
})

