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
		lastInputCurrency: ''
	}),
	
	getters: {
		// 获取已选币种数量
		selectedCount: (state) => state.selectedCurrencies.length,
		
		// 检查币种是否已选
		isSelected: (state) => (code) => {
			return state.selectedCurrencies.includes(code)
		}
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
		}
	}
})

