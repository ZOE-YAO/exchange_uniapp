import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
	state: () => ({
		// 用户选择的币种代码列表
		selectedCurrencies: ['CNY', 'USD', 'EUR'],
		
		// 各币种的金额
		amounts: {
			'CNY': '',
			'USD': '',
			'EUR': ''
		},
		
		// 当前正在输入的币种（活跃币种）
		activeCurrency: ''
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
				
				if (currencies && currencies.length > 0) {
					this.selectedCurrencies = currencies
				}
				
				if (amounts) {
					this.amounts = amounts
				}
			} catch (error) {
				console.error('加载币种数据失败:', error)
			}
		}
	}
})

