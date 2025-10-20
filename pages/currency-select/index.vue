<template>
	<view class="currency-select-page">
		<!-- 搜索栏 -->
		<view class="search-bar safe-area-inset-top">
			<view class="search-input">
				<text class="search-icon">🔍</text>
				<input 
					type="text" 
					v-model="searchKeyword" 
					:placeholder="t('currencySelect.search')"
					placeholder-class="search-placeholder"
					@input="handleSearch"
				/>
				<text class="clear-icon" v-if="searchKeyword" @click="clearSearch">×</text>
			</view>
		</view>
		
		<!-- 币种列表 -->
		<scroll-view class="currency-list" scroll-y>
			<!-- 常用币种 -->
			<view class="currency-section" v-if="!searchKeyword && popularList.length > 0">
				<view class="section-title">{{ t('currencySelect.popular') }}</view>
				<currency-item 
					v-for="currency in popularList" 
					:key="currency.code"
					:currency="currency"
					:selected="isSelected(currency.code)"
					@click="toggleCurrency"
				/>
			</view>
			
			<!-- 全部币种 -->
			<view class="currency-section">
				<view class="section-title" v-if="!searchKeyword">
					{{ t('currencySelect.all') }} ({{ filteredList.length }})
				</view>
				<currency-item 
					v-for="currency in filteredList" 
					:key="currency.code"
					:currency="currency"
					:selected="isSelected(currency.code)"
					@click="toggleCurrency"
				/>
				
				<!-- 空状态 -->
				<view class="empty" v-if="filteredList.length === 0">
					<text class="empty-icon">🔍</text>
					<text class="empty-text">未找到相关币种</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCurrencyStore } from '@/store/currency'
import { currencyList, getPopularCurrencies, searchCurrencies } from '@/data/currencies'
import { t } from '@/utils/i18n'
import CurrencyItem from '@/components/currency-item/index.vue'

const currencyStore = useCurrencyStore()

const searchKeyword = ref('')
const allCurrencies = ref(currencyList)

// 常用币种列表
const popularList = computed(() => {
	return getPopularCurrencies()
})

// 过滤后的币种列表
const filteredList = computed(() => {
	if (searchKeyword.value) {
		return searchCurrencies(searchKeyword.value)
	}
	return allCurrencies.value
})

// 检查是否已选
const isSelected = (code) => {
	return currencyStore.isSelected(code)
}

// 搜索处理
const handleSearch = () => {
	// 防抖已通过 computed 实现
}

// 清空搜索
const clearSearch = () => {
	searchKeyword.value = ''
}

// 切换币种选择
const toggleCurrency = (code) => {
	if (isSelected(code)) {
		// 检查是否至少保留2个币种
		if (currencyStore.selectedCount <= 2) {
			uni.showToast({
				title: t('tips.minCurrencies'),
				icon: 'none'
			})
			return
		}
		currencyStore.removeCurrency(code)
	} else {
		// 检查是否超过最大数量
		if (currencyStore.selectedCount >= 10) {
			uni.showToast({
				title: t('tips.maxCurrencies'),
				icon: 'none'
			})
			return
		}
		currencyStore.addCurrency(code)
	}
	
	// 触发事件通知主页更新
	uni.$emit('currencySelected')
}

onMounted(() => {
	// 页面加载时的初始化
})

// 页面卸载时清理
onUnmounted(() => {
	// 通知主页币种已更新
	uni.$emit('currencySelected')
})
</script>

<style lang="scss" scoped>
.currency-select-page {
	min-height: 100vh;
	background: var(--bg-primary);
	
	.search-bar {
		background: var(--bg-secondary);
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid var(--border-color);
		position: sticky;
		top: 0;
		z-index: 10;
		
		.search-input {
			display: flex;
			align-items: center;
			background: var(--bg-primary);
			border-radius: var(--radius-md);
			padding: 16rpx 24rpx;
			
			.search-icon {
				font-size: 32rpx;
				margin-right: 12rpx;
			}
			
			input {
				flex: 1;
				font-size: 28rpx;
				color: var(--text-primary);
			}
			
			.search-placeholder {
				color: var(--text-placeholder);
			}
			
			.clear-icon {
				font-size: 48rpx;
				color: var(--text-secondary);
				line-height: 1;
				padding: 0 8rpx;
			}
		}
	}
	
	.currency-list {
		height: calc(100vh - 120rpx);
		
		.currency-section {
			.section-title {
				padding: 24rpx 32rpx 16rpx;
				font-size: 26rpx;
				color: var(--text-secondary);
				font-weight: 500;
				background: var(--bg-primary);
			}
		}
	}
}
</style>

