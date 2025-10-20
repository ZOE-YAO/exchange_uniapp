<template>
	<view class="settings-page">
		<scroll-view class="settings-scroll" scroll-y>
			<!-- 显示设置 -->
			<view class="settings-section">
				<view class="section-title">{{ t('settings.display') }}</view>
				<view class="settings-list">
					<view class="setting-item" @click="showLanguagePicker">
						<text class="item-label">{{ t('settings.language') }}</text>
						<view class="item-value">
							<text class="value-text">{{ currentLanguageName }}</text>
							<text class="arrow">›</text>
						</view>
					</view>
					
					<view class="setting-item" @click="showDecimalPicker">
						<text class="item-label">{{ t('settings.decimalPlaces') }}</text>
						<view class="item-value">
							<text class="value-text">{{ settingsStore.decimalPlaces }} 位</text>
							<text class="arrow">›</text>
						</view>
					</view>
					
					<view class="setting-item" @click="showSeparatorPicker">
						<text class="item-label">{{ t('settings.thousandSeparator') }}</text>
						<view class="item-value">
							<text class="value-text">{{ currentSeparatorName }}</text>
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 数据设置 -->
			<view class="settings-section">
				<view class="section-title">{{ t('settings.data') }}</view>
				<view class="settings-list">
					<view class="setting-item">
						<text class="item-label">{{ t('settings.autoUpdate') }}</text>
						<switch 
							:checked="settingsStore.autoUpdate" 
							@change="handleAutoUpdateChange"
							color="#007AFF"
						/>
					</view>
					
					<view class="setting-item" @click="handleClearCache">
						<text class="item-label">{{ t('settings.clearCache') }}</text>
						<view class="item-value">
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 主题外观 -->
			<view class="settings-section">
				<view class="section-title">{{ t('settings.theme') }}</view>
				<view class="settings-list">
					<view class="setting-item" @click="showThemePicker">
						<text class="item-label">{{ t('settings.themeMode') }}</text>
						<view class="item-value">
							<text class="value-text">{{ currentThemeName }}</text>
							<text class="arrow">›</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 关于 -->
			<view class="settings-section">
				<view class="section-title">{{ t('settings.about') }}</view>
				<view class="settings-list">
					<view class="setting-item" @click="goToAbout">
						<text class="item-label">{{ t('settings.aboutApp') }}</text>
						<view class="item-value">
							<text class="arrow">›</text>
						</view>
					</view>
					
					<view class="setting-item">
						<text class="item-label">{{ t('settings.version') }}</text>
						<text class="value-text">1.0.0</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/store/settings'
import { t, setLocale } from '@/utils/i18n'

const settingsStore = useSettingsStore()

// 当前语言名称
const currentLanguageName = computed(() => {
	return settingsStore.locale === 'zh-CN' ? '简体中文' : 'English'
})

// 当前千分位分隔符名称
const currentSeparatorName = computed(() => {
	const map = {
		',': '逗号 (,)',
		'.': '点 (.)',
		' ': '空格',
		'': '无'
	}
	return map[settingsStore.thousandSeparator] || '逗号'
})

// 当前主题名称
const currentThemeName = computed(() => {
	const map = {
		'light': t('settings.light'),
		'dark': t('settings.dark'),
		'auto': t('settings.auto')
	}
	return map[settingsStore.theme] || t('settings.auto')
})

// 显示语言选择器
const showLanguagePicker = () => {
	uni.showActionSheet({
		itemList: ['简体中文', 'English'],
		success: (res) => {
			const locales = ['zh-CN', 'en-US']
			const selectedLocale = locales[res.tapIndex]
			settingsStore.setLocale(selectedLocale)
			setLocale(selectedLocale)
			
			// 提示重启应用生效
			uni.showToast({
				title: '语言已切换',
				icon: 'success'
			})
		}
	})
}

// 显示小数位选择器
const showDecimalPicker = () => {
	uni.showActionSheet({
		itemList: ['2 位', '4 位', '6 位', '8 位'],
		success: (res) => {
			const decimals = [2, 4, 6, 8]
			settingsStore.setDecimalPlaces(decimals[res.tapIndex])
		}
	})
}

// 显示千分位分隔符选择器
const showSeparatorPicker = () => {
	uni.showActionSheet({
		itemList: ['逗号 (,)', '点 (.)', '空格', '无'],
		success: (res) => {
			const separators = [',', '.', ' ', '']
			settingsStore.setThousandSeparator(separators[res.tapIndex])
		}
	})
}

// 显示主题选择器
const showThemePicker = () => {
	uni.showActionSheet({
		itemList: [t('settings.light'), t('settings.dark'), t('settings.auto')],
		success: (res) => {
			const themes = ['light', 'dark', 'auto']
			settingsStore.setTheme(themes[res.tapIndex])
		}
	})
}

// 自动更新切换
const handleAutoUpdateChange = (e) => {
	settingsStore.setAutoUpdate(e.detail.value)
}

// 清除缓存
const handleClearCache = () => {
	uni.showModal({
		title: '提示',
		content: t('settings.clearCacheConfirm'),
		success: (res) => {
			if (res.confirm) {
				try {
					// 清除所有存储（除了设置本身）
					uni.removeStorageSync('exchangeRates')
					uni.removeStorageSync('ratesBase')
					uni.removeStorageSync('ratesLastUpdate')
					uni.removeStorageSync('selectedCurrencies')
					uni.removeStorageSync('currencyAmounts')
					
					uni.showToast({
						title: t('settings.clearCacheSuccess'),
						icon: 'success'
					})
				} catch (error) {
					uni.showToast({
						title: '清除失败',
						icon: 'error'
					})
				}
			}
		}
	})
}

// 跳转到关于页面
const goToAbout = () => {
	uni.showModal({
		title: '关于汇率速算',
		content: '汇率速算是一款轻量、流畅的多币种汇率计算工具。\n\n版本：1.0.0\n开发者：Your Name',
		showCancel: false
	})
}
</script>

<style lang="scss" scoped>
.settings-page {
	min-height: 100vh;
	background: var(--bg-primary);
	
	.settings-scroll {
		height: 100vh;
		
		.settings-section {
			margin-bottom: 32rpx;
			
			.section-title {
				padding: 32rpx 32rpx 16rpx;
				font-size: 26rpx;
				color: var(--text-secondary);
				font-weight: 500;
			}
			
			.settings-list {
				background: var(--bg-secondary);
				
				.setting-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 32rpx;
					border-bottom: 1rpx solid var(--border-light);
					transition: background 0.2s;
					
					&:last-child {
						border-bottom: none;
					}
					
					&:active {
						background: var(--bg-active);
					}
					
					.item-label {
						font-size: 30rpx;
						color: var(--text-primary);
					}
					
					.item-value {
						display: flex;
						align-items: center;
						gap: 12rpx;
						
						.value-text {
							font-size: 28rpx;
							color: var(--text-secondary);
						}
						
						.arrow {
							font-size: 40rpx;
							color: var(--text-placeholder);
							line-height: 1;
						}
					}
				}
			}
		}
	}
}
</style>

