import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		// 语言设置
		locale: 'zh-CN', // 'zh-CN' | 'en-US'
		
		// 小数位数
		decimalPlaces: 2, // 2 | 4 | 6 | 8
		
		// 千分位分隔符
		thousandSeparator: ',', // ',' | '.' | ' ' | ''
		
		// 主题模式
		theme: 'auto', // 'light' | 'dark' | 'auto'
		
		// 自动更新汇率
		autoUpdate: true
	}),
	
	getters: {
		// 获取当前主题（如果是auto则根据系统判断）
		currentTheme: (state) => {
			if (state.theme === 'auto') {
				// 检测系统主题
				// #ifdef APP-PLUS
				const systemInfo = uni.getSystemInfoSync()
				return systemInfo.theme || 'light'
				// #endif
				
				// #ifndef APP-PLUS
				return 'light'
				// #endif
			}
			return state.theme
		}
	},
	
	actions: {
		// 设置语言
		setLocale(locale) {
			this.locale = locale
			this.saveToStorage()
		},
		
		// 设置小数位数
		setDecimalPlaces(places) {
			this.decimalPlaces = places
			this.saveToStorage()
		},
		
		// 设置千分位分隔符
		setThousandSeparator(separator) {
			this.thousandSeparator = separator
			this.saveToStorage()
		},
		
		// 设置主题
		setTheme(theme) {
			this.theme = theme
			this.applyTheme(this.currentTheme)
			this.saveToStorage()
		},
		
		// 应用主题
		applyTheme(theme) {
			// #ifdef APP-PLUS
			// 在 App.vue 中监听并应用主题
			uni.$emit('themeChange', theme)
			// #endif
		},
		
		// 设置自动更新
		setAutoUpdate(value) {
			this.autoUpdate = value
			this.saveToStorage()
		},
		
		// 保存到本地存储
		saveToStorage() {
			try {
				uni.setStorageSync('settings', {
					locale: this.locale,
					decimalPlaces: this.decimalPlaces,
					thousandSeparator: this.thousandSeparator,
					theme: this.theme,
					autoUpdate: this.autoUpdate
				})
			} catch (error) {
				console.error('保存设置失败:', error)
			}
		},
		
		// 从本地存储加载
		loadFromStorage() {
			try {
				const settings = uni.getStorageSync('settings')
				if (settings) {
					this.locale = settings.locale || 'zh-CN'
					this.decimalPlaces = settings.decimalPlaces || 2
					this.thousandSeparator = settings.thousandSeparator || ','
					this.theme = settings.theme || 'auto'
					this.autoUpdate = settings.autoUpdate !== undefined ? settings.autoUpdate : true
					
					// 应用主题
					this.applyTheme(this.currentTheme)
				}
			} catch (error) {
				console.error('加载设置失败:', error)
			}
		}
	}
})

