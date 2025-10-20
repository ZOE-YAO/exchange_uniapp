<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useCurrencyStore } from '@/store/currency'
import { useRateStore } from '@/store/rate'
import { useSettingsStore } from '@/store/settings'
import { setLocale } from '@/utils/i18n'

const currencyStore = useCurrencyStore()
const rateStore = useRateStore()
const settingsStore = useSettingsStore()

onLaunch(() => {
	console.log('App Launch')
	
	// 加载本地存储的数据
	settingsStore.loadFromStorage()
	currencyStore.loadFromStorage()
	rateStore.loadFromStorage()
	
	// 设置多语言
	setLocale(settingsStore.locale)
	
	// 应用主题
	applyTheme(settingsStore.currentTheme)
	
	// 如果开启自动更新，获取最新汇率
	if (settingsStore.autoUpdate) {
		rateStore.fetchRates()
	}
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})

// 应用主题
const applyTheme = (theme) => {
	// 设置主题属性
	if (theme === 'dark') {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle('light')
		// #endif
	} else {
		// #ifdef APP-PLUS
		plus.navigator.setStatusBarStyle('dark')
		// #endif
	}
}

// 监听主题变化
uni.$on('themeChange', (theme) => {
	applyTheme(theme)
})
</script>

<style lang="scss">
/* 导入主题变量 */
@import '@/theme/variables.scss';
@import '@/theme/common.scss';

/* 每个页面公共css */
page {
	background-color: var(--bg-primary);
}
</style>
