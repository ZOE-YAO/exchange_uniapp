<template>
	<view class="exchange-page">
		<!-- 顶部更新信息栏 -->
		<view class="update-bar">
			<view class="update-info">
				<text class="update-text">{{ formatUpdateDate }}</text>
			</view>
			
			<!-- 基准货币选择器 -->
			<view class="base-selector" @click="showBaseCurrencyPicker">
				<text class="base-label">基准</text>
				<text class="base-divider">|</text>
				<text class="base-currency">{{ rateStore.base || 'USD' }}</text>
				<text class="base-arrow">{{ showBaseModal ? '▲' : '▼' }}</text>
			</view>
		</view>
		
		<!-- 币种卡片列表 -->
		<scroll-view 
			class="currency-list"
			:class="{ 'keyboard-open': keyboardVisible }"
			scroll-y
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onPullDownRefresh"
			@refresherrestore="onRefreshRestore"
		>
			<view class="currency-cards">
				<currency-input
					v-for="(code, index) in displayCurrencies"
					:key="code"
					:currency-info="getCurrencyInfo(code)"
					:amount="displayAmount(code)"
					:rate-display="getRateDisplay(code)"
					:is-base="code === rateStore.base"
					:is-active="code === currentInputCurrency"
					:is-editing="code === currentInputCurrency && keyboardVisible"
					:is-showing-old-value="code === currentInputCurrency && keyboardVisible && (inputValue === '0' || inputValue === '')"
					:show-delete="false"
					@focus="handleFocus(code)"
					@delete="handleDelete(code)"
					@longpress="handleLongPress(code)"
				/>
				
				<!-- 添加币种按钮 -->
				<view class="add-currency-btn" @click="goToSelectCurrency" v-if="currencyStore.selectedCount < 10">
					<text class="add-icon">+</text>
					<text class="add-text">{{ t('home.addCurrency') }}</text>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty" v-if="currencyStore.selectedCount === 0">
				<text class="empty-icon">💱</text>
				<text class="empty-text">请添加币种开始使用</text>
			</view>
		</scroll-view>
		
		<!-- 计算器键盘 -->
		<calculator-keyboard
			v-model:visible="keyboardVisible"
			v-model:value="inputValue"
			:title="keyboardTitle"
			:current-currency="getCurrencyInfo(currentInputCurrency)"
			@input="handleInput"
			@close="handleKeyboardClose"
		/>
		
		<!-- 基准货币选择下拉框 -->
		<view class="base-dropdown" v-if="showBaseModal" @click.stop="showBaseModal = false">
			<view class="dropdown-mask"></view>
			<view class="dropdown-content" @click.stop>
				<view 
					v-for="code in currencyStore.selectedCurrencies" 
					:key="code"
					class="dropdown-item"
					:class="{ 'active': code === rateStore.base }"
					@click.stop="changeBaseCurrency(code)"
				>
					<text class="item-flag">{{ getCurrencyInfo(code).flag }}</text>
					<text class="item-code">{{ code }}</text>
					<text class="item-name">{{ getCurrencyInfo(code).name }}</text>
					<text class="item-check" v-if="code === rateStore.base">✓</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCurrencyStore } from '@/store/currency'
import { useRateStore } from '@/store/rate'
import { useSettingsStore } from '@/store/settings'
import { getCurrencyByCode } from '@/data/currencies'
import { convertCurrency, formatAmount } from '@/utils/calculate'
import { t } from '@/utils/i18n'
import CurrencyInput from '@/components/currency-input/index.vue'
import CalculatorKeyboard from '@/components/calculator-keyboard/index.vue'

const currencyStore = useCurrencyStore()
const rateStore = useRateStore()
const settingsStore = useSettingsStore()

// 键盘状态
const keyboardVisible = ref(false)
const inputValue = ref('')
const currentInputCurrency = ref('')

// 刷新状态
const isRefreshing = ref(false)

// 基准货币选择
const showBaseModal = ref(false)

// 显示的币种列表（当前输入币种置顶）
const displayCurrencies = computed(() => {
	const currencies = [...currencyStore.selectedCurrencies]
	
	// 如果有当前输入币种，将其移到第一位
	if (currentInputCurrency.value && currencies.includes(currentInputCurrency.value)) {
		const index = currencies.indexOf(currentInputCurrency.value)
		currencies.splice(index, 1)
		currencies.unshift(currentInputCurrency.value)
	}
	
	return currencies
})

// 键盘标题
const keyboardTitle = computed(() => {
	if (!currentInputCurrency.value) return t('home.title')
	const currency = getCurrencyInfo(currentInputCurrency.value)
	return `${currency.flag} ${currency.code} ${currency.name}`
})

// 获取币种信息
const getCurrencyInfo = (code) => {
	return getCurrencyByCode(code) || { code, symbol: '', name: code, flag: '🏳️' }
}

// 显示格式化的金额
const displayAmount = (code) => {
	const amount = currencyStore.amounts[code]
	
	// 如果是当前输入的币种且键盘可见（编辑状态）
	if (code === currentInputCurrency.value && keyboardVisible.value) {
		// 如果键盘上的值是 '0' 或空，显示老数值（置灰，最多2位小数）
		if (inputValue.value === '0' || inputValue.value === '') {
			if (!amount || amount === '0' || amount === '') {
				return '0'
			}
			// 老数值：判断是否有小数
			const numValue = parseFloat(amount)
			const hasDecimal = amount.includes('.') && numValue !== Math.floor(numValue)
			if (hasDecimal) {
				// 有小数，显示最多2位小数
				// 先转换为数字，保留2位小数，再去除尾部多余的0
				let formatted = numValue.toFixed(2)
				// 去除尾部多余的0
				formatted = formatted.replace(/\.?0+$/, '')
				// 如果去除后没有小数了，就是整数
				if (!formatted.includes('.')) {
					return formatAmount(formatted, 0, settingsStore.thousandSeparator)
				}
				return formatAmount(formatted, -1, settingsStore.thousandSeparator)
			} else {
				// 没有小数，不显示小数部分
				return formatAmount(Math.floor(numValue).toString(), 0, settingsStore.thousandSeparator)
			}
		} else {
			// 正在输入新值，显示新值（带千分位）
			return formatAmount(inputValue.value, -1, settingsStore.thousandSeparator)
		}
	}
	
	// 非编辑状态
	if (!amount || amount === '0' || amount === '') {
		return '0'
	}
	
	// 格式化显示：如果没有小数点，不显示小数部分
	let formattedAmount = amount
	
	// 判断是否有小数点
	const hasDecimal = amount.includes('.')
	
	if (hasDecimal) {
		// 有小数点，保留指定位数
		formattedAmount = formatAmount(
			amount,
			settingsStore.decimalPlaces,
			settingsStore.thousandSeparator
		)
	} else {
		// 没有小数点，只添加千分位，不显示小数
		formattedAmount = formatAmount(
			amount,
			0, // 不显示小数
			settingsStore.thousandSeparator
		)
	}
	
	return formattedAmount
}

// 获取汇率信息（相对于基准货币）
const getRateInfo = (code) => {
	// 增加安全检查
	if (!rateStore.hasRates) return ''
	if (!rateStore.rates || typeof rateStore.rates !== 'object') return ''
	if (code === rateStore.base) return '基准货币'
	
	const rate = rateStore.rates[code]
	if (!rate) return ''
	
	// 显示相对于基准货币的汇率
	const baseCode = rateStore.base || 'USD'
	return `1 ${baseCode} = ${formatAmount(rate.toString(), 4, '')} ${code}`
}

// 获取汇率右上角显示（智能显示）
const getRateDisplay = (code) => {
	// 安全检查
	if (!rateStore.hasRates) return ''
	if (!rateStore.rates || typeof rateStore.rates !== 'object') return ''
	
	// 如果是基准货币，不显示
	if (code === rateStore.base) return ''
	
	const rate = rateStore.rates[code]
	if (!rate) return ''
	
	const baseCode = rateStore.base || 'USD'
	
	// 规则：
	// 如果汇率 > 1，说明该货币比基准货币"便宜"，显示：xx CODE = 1 BASE
	// 如果汇率 <= 1，说明该货币比基准货币"贵"，显示：1 CODE = xx BASE
	if (rate > 1) {
		// 例如：CNY = 7.25，显示：7.25 CNY = 1 USD
		const displayRate = rate >= 100 ? rate.toFixed(0) : rate.toFixed(2)
		return `${displayRate} ${code} = 1 ${baseCode}`
	} else {
		// 例如：EUR = 0.93，显示：1 EUR = 1.08 USD
		// 需要反向计算
		const inverseRate = 1 / rate
		const displayRate = inverseRate >= 100 ? inverseRate.toFixed(0) : inverseRate.toFixed(2)
		return `1 ${code} = ${displayRate} ${baseCode}`
	}
}

// 格式化更新日期（使用API返回的时间）
const formatUpdateDate = computed(() => {
	if (!rateStore.lastUpdate) return '汇率数据未更新'
	
	const date = new Date(rateStore.lastUpdate)
	const now = new Date()
	
	// 判断是否是今天
	const isToday = date.getDate() === now.getDate() &&
	                date.getMonth() === now.getMonth() &&
	                date.getFullYear() === now.getFullYear()
	
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	
	if (isToday) {
		return `今日汇率已更新 ${hours}:${minutes}`
	} else {
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `汇率更新于 ${month}-${day} ${hours}:${minutes}`
	}
})

// 处理卡片点击（聚焦输入）
const handleFocus = (code) => {
	// 如果点击的是当前输入币种，不做处理
	if (currentInputCurrency.value === code && keyboardVisible.value) {
		return
	}
	
	currentInputCurrency.value = code
	// 键盘初始值设为 '0'，让用户从头输入
	inputValue.value = '0'
	keyboardVisible.value = true
	
	// 触发震动反馈
	// #ifdef APP-PLUS
	uni.vibrateShort({ type: 'light' })
	// #endif
}

// 处理数字键盘输入
const handleInput = (value) => {
	console.log('⌨️ 键盘输入:', value, '当前币种:', currentInputCurrency.value)
	
	// 更新输入值
	inputValue.value = value
	
	// 更新当前币种的金额
	currencyStore.updateAmount(currentInputCurrency.value, value)
	
	// 计算其他币种的金额
	if (value && value !== '0' && value !== '') {
		console.log('🔄 开始计算其他币种...')
		calculateOtherCurrencies(currentInputCurrency.value, value)
	} else {
		console.log('🧹 清空其他币种')
		clearOtherCurrencies(currentInputCurrency.value)
	}
}

// 计算其他币种的金额
const calculateOtherCurrencies = (fromCode, amount) => {
	console.log('🧮 计算其他币种:', { fromCode, amount, hasRates: rateStore.hasRates })
	
	if (!rateStore.hasRates) {
		console.warn('❌ 汇率数据未加载')
		return
	}
	
	// 安全检查
	if (!rateStore.rates || typeof rateStore.rates !== 'object') {
		console.warn('❌ 汇率数据格式错误')
		return
	}
	
	console.log('💱 可用汇率:', Object.keys(rateStore.rates).slice(0, 5))
	
	currencyStore.selectedCurrencies.forEach(toCode => {
		if (toCode !== fromCode) {
			const result = convertCurrency(amount, fromCode, toCode, rateStore.rates)
			currencyStore.amounts[toCode] = result
			console.log(`  ${fromCode} → ${toCode}: ${amount} → ${result}`)
		}
	})
	
	console.log('✅ 计算完成')
}

// 清空其他币种的金额
const clearOtherCurrencies = (exceptCode) => {
	currencyStore.selectedCurrencies.forEach(code => {
		if (code !== exceptCode) {
			currencyStore.amounts[code] = ''
		}
	})
}

// 关闭键盘
const handleKeyboardClose = () => {
	keyboardVisible.value = false
	currentInputCurrency.value = ''
	
	// 保存数据
	currencyStore.saveToStorage()
}

// 删除币种
const handleDelete = (code) => {
	uni.showModal({
		title: '提示',
		content: `确定要删除 ${getCurrencyInfo(code).name} 吗？`,
		success: (res) => {
			if (res.confirm) {
				currencyStore.removeCurrency(code)
				
				// 如果删除的是当前输入币种，关闭键盘
				if (code === currentInputCurrency.value) {
					keyboardVisible.value = false
					currentInputCurrency.value = ''
				}
			}
		}
	})
}

// 长按币种（可以添加更多操作）
const handleLongPress = (code) => {
	uni.showActionSheet({
		itemList: ['删除此币种', '清空此金额'],
		success: (res) => {
			if (res.tapIndex === 0) {
				handleDelete(code)
			} else if (res.tapIndex === 1) {
				currencyStore.amounts[code] = ''
				if (code === currentInputCurrency.value) {
					inputValue.value = ''
				}
			}
		}
	})
}

// 跳转到币种选择页
const goToSelectCurrency = () => {
	uni.navigateTo({
		url: '/pages/currency-select/index'
	})
}

// 显示基准货币选择器
const showBaseCurrencyPicker = () => {
	showBaseModal.value = !showBaseModal.value
}

// 切换基准货币
const changeBaseCurrency = async (code) => {
	console.log('切换基准货币:', code)
	showBaseModal.value = false
	
	if (code !== rateStore.base) {
		rateStore.base = code
		await rateStore.fetchRates(code)
		
		// 如果有输入值，重新计算
		if (currentInputCurrency.value && inputValue.value) {
			calculateOtherCurrencies(currentInputCurrency.value, inputValue.value)
		}
		
		// 切换成功，不显示提示
	}
}

// 刷新汇率
const handleRefresh = async () => {
	if (isRefreshing.value) return
	
	isRefreshing.value = true
	
	try {
		const success = await rateStore.fetchRates()
		
		if (success) {
			uni.showToast({
				title: '汇率已更新',
				icon: 'success',
				duration: 1500
			})
			
			// 如果有输入值，重新计算
			if (currentInputCurrency.value && inputValue.value) {
				calculateOtherCurrencies(currentInputCurrency.value, inputValue.value)
			}
		} else {
			uni.showToast({
				title: '更新失败，使用缓存数据',
				icon: 'none',
				duration: 2000
			})
		}
	} catch (error) {
		console.error('刷新汇率失败:', error)
	} finally {
		isRefreshing.value = false
	}
}

// 下拉刷新
const onPullDownRefresh = () => {
	handleRefresh()
}

// 刷新恢复
const onRefreshRestore = () => {
	isRefreshing.value = false
}

// 页面加载
onMounted(async () => {
	console.log('📱 ========== 主页加载开始 ==========')
	
	// 1. 先尝试加载本地缓存
	const hasCachedData = rateStore.loadFromStorage()
	
	if (hasCachedData) {
		console.log('💾 使用本地缓存，汇率数量：', Object.keys(rateStore.rates || {}).length)
	}
	
	// 2. 异步获取最新汇率（无论本地是否有数据）
	console.log('🌐 开始获取最新在线汇率...')
	const success = await rateStore.fetchRates()
	
	if (success) {
		console.log('✅ 在线汇率获取成功')
	} else {
		console.warn('⚠️ 在线汇率获取失败，使用备用数据')
	}
	
	// 3. 最终检查数据状态
	console.log('📊 最终数据状态检查:')
	console.log('  - hasRates:', rateStore.hasRates)
	console.log('  - rates 类型:', typeof rateStore.rates)
	console.log('  - rates 是否为对象:', rateStore.rates && typeof rateStore.rates === 'object')
	
	if (rateStore.rates) {
		const rateKeys = Object.keys(rateStore.rates)
		console.log('  - 汇率数量:', rateKeys.length)
		console.log('  - 前5个币种:', rateKeys.slice(0, 5))
	}
	
	// 4. 确保有汇率数据后再计算
	if (rateStore.hasRates) {
		console.log('✅ 汇率数据已就绪！')
		
		// 如果有活跃币种和金额，重新计算
		if (currencyStore.activeCurrency && currencyStore.amounts[currencyStore.activeCurrency]) {
			console.log('🔄 重新计算货币金额')
			calculateOtherCurrencies(
				currencyStore.activeCurrency,
				currencyStore.amounts[currencyStore.activeCurrency]
			)
		}
	} else {
		console.error('❌ 汇率数据未就绪！请检查网络或数据文件')
		// 最后的备用方案：直接加载默认数据
		console.log('🆘 尝试加载默认汇率数据...')
		await rateStore.loadDefaultRates()
		
		if (rateStore.hasRates) {
			console.log('✅ 默认数据加载成功！')
		} else {
			console.error('💥 所有数据源均失败，无法继续')
		}
	}
	
	console.log('📱 ========== 主页加载完成 ==========')
})

// 监听页面显示（从币种选择页返回时）
uni.$on('currencySelected', () => {
	// 重新计算汇率
	if (currentInputCurrency.value && inputValue.value) {
		calculateOtherCurrencies(currentInputCurrency.value, inputValue.value)
	}
})
</script>

<style lang="scss" scoped>
.exchange-page {
	min-height: 100vh;
	background: var(--bg-primary);
	display: flex;
	flex-direction: column;
	
	.update-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: calc(env(safe-area-inset-top) + 16rpx) 24rpx 12rpx;
		background: transparent;
		z-index: 10;
		position: sticky;
		top: 0;
		
		.update-info {
			flex: 1;
			padding-left: 4rpx;
			
			.update-text {
				font-size: 24rpx;
				color: #999;
				font-weight: 600;
			}
		}
		
		.base-selector {
			display: flex;
			align-items: center;
			gap: 8rpx;
			padding: 8rpx 16rpx;
			background: #e8e8ed;
			border-radius: 16rpx;
			transition: all 0.3s;
			cursor: pointer;
			
			&:active {
				background: #d8d8dd;
			}
			
			.base-label {
				font-size: 22rpx;
				color: #666;
				font-weight: 400;
			}
			
			.base-divider {
				font-size: 22rpx;
				color: #ddd;
				font-weight: 300;
			}
			
			.base-currency {
				font-size: 24rpx;
				color: #333;
				font-weight: 600;
			}
			
			.base-arrow {
				font-size: 18rpx;
				color: #999;
				margin-left: 2rpx;
			}
		}
	}
	
	// 基准货币下拉框
	.base-dropdown {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		
		.dropdown-mask {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: transparent;
		}
		
		.dropdown-content {
			position: absolute;
			top: calc(env(safe-area-inset-top) + 72rpx);
			right: 24rpx;
			background: #fff;
			border-radius: 16rpx;
			box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
			overflow: hidden;
			min-width: 280rpx;
			max-height: 500rpx;
			overflow-y: auto;
			animation: slideDown 0.3s ease-out;
			
			.dropdown-item {
				display: flex;
				align-items: center;
				padding: 20rpx 24rpx;
				gap: 12rpx;
				transition: background 0.2s;
				
				&:active {
					background: #f5f5f7;
				}
				
				&.active {
					background: #f0f4ff;
				}
				
				.item-flag {
					font-size: 32rpx;
				}
				
				.item-code {
					font-size: 26rpx;
					font-weight: 600;
					color: #333;
					min-width: 60rpx;
				}
				
				.item-name {
					flex: 1;
					font-size: 24rpx;
					color: #666;
				}
				
				.item-check {
					font-size: 28rpx;
					color: #667eea;
				}
			}
		}
	}
	
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.currency-list {
		flex: 1;
		padding: 0;
		
		&.keyboard-open {
			// 键盘打开时，减少高度以显示至少2个卡片
			max-height: 40vh;
		}
		
		.currency-cards {
			padding: 12rpx 24rpx 120rpx 24rpx;
		}
		
		.add-currency-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 48rpx 32rpx;
			background: var(--bg-card);
			border-radius: 20rpx;
			border: 2rpx dashed #e0e0e0;
			margin: 0 0 16rpx 0;
			transition: all 0.3s;
			
			&:active {
				transform: scale(0.98);
				background: var(--bg-active);
			}
			
			.add-icon {
				font-size: 64rpx;
				color: var(--color-primary);
				line-height: 1;
				margin-bottom: 12rpx;
			}
			
			.add-text {
				font-size: 28rpx;
				color: var(--text-secondary);
			}
		}
	}
}

@keyframes rotating {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
