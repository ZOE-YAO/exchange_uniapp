<template>
	<view class="currency-card" @longpress="handleLongPress" :class="{ 'card-active': isActive }">
		<!-- 顶部一行：国旗、货币名称、汇率 -->
		<view class="card-header">
			<view class="currency-basic">
				<text class="currency-flag">{{ currencyInfo.flag }}</text>
			<view class="currency-names">
				<text class="currency-name-only">{{ currencyInfo.name }}</text>
			</view>
			</view>
			<view class="rate-display" v-if="rateDisplay">
				<text class="rate-text">{{ rateDisplay }}</text>
			</view>
		</view>
		
		<!-- 输入框 -->
		<view class="amount-input" @click="handleFocus">
			<text class="currency-symbol">{{ currencyInfo.symbol }}</text>
			<text class="amount-value" :class="{ 'amount-zero': !amount || amount === '0', 'amount-active': isActive && !isEditing }">
				{{ displayAmount }}
			</text>
		</view>
	</view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	currencyInfo: {
		type: Object,
		required: true
	},
	amount: {
		type: String,
		default: ''
	},
	rateInfo: {
		type: String,
		default: ''
	},
	rateDisplay: {
		type: String,
		default: ''
	},
	isBase: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: false
	},
	isEditing: {
		type: Boolean,
		default: false
	},
	showDelete: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['focus', 'delete', 'longpress'])

// 显示格式化的金额
const displayAmount = computed(() => {
	// 如果没有金额或为0，显示 0
	if (!props.amount || props.amount === '0' || props.amount === '') {
		return '0'
	}
	return props.amount
})

// 点击卡片聚焦
const handleFocus = () => {
	emit('focus', props.currencyInfo.code)
}

// 删除币种
const handleDelete = () => {
	emit('delete', props.currencyInfo.code)
}

// 长按
const handleLongPress = () => {
	emit('longpress', props.currencyInfo.code)
}
</script>

<style lang="scss" scoped>
.currency-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	margin: 0 0 12rpx 0;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
	transition: all 0.3s;
	border: 2rpx solid transparent;
	
	&:active {
		transform: scale(0.98);
	}
	
	&.card-active {
		border-color: #007AFF;
		box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.15);
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
		
		.currency-basic {
			display: flex;
			align-items: center;
			gap: 12rpx;
			flex: 1;
			
			.currency-flag {
				font-size: 40rpx;
				line-height: 1;
			}
			
			.currency-names {
				display: flex;
				align-items: center;
				
				.currency-name-only {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
				}
			}
		}
		
		.rate-display {
			flex-shrink: 0;
			
			.rate-text {
				font-size: 20rpx;
				color: #bbb;
				font-weight: 400;
			}
		}
	}
	
	.delete-btn {
		width: 48rpx;
		height: 48rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-delete, #ff3b30);
		border-radius: 50%;
		
		.delete-icon {
			font-size: 36rpx;
			color: #fff;
			font-weight: 300;
			line-height: 1;
		}
	}
	
	.amount-input {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
		padding: 12rpx 0 0;
		
		.currency-symbol {
			font-size: 28rpx;
			color: #bbb;
			font-weight: 400;
		}
		
		.amount-value {
			flex: 1;
			font-size: 48rpx;
			font-weight: 600;
			color: #333;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
			transition: color 0.3s;
			
			&.amount-zero {
				color: #ddd;
			}
			
			&.amount-active {
				color: #007AFF;
			}
		}
	}
	
	.rate-info {
		padding-top: 12rpx;
		border-top: 1rpx solid var(--border-light, #f0f0f0);
		margin-top: 16rpx;
		
		.rate-text {
			font-size: 24rpx;
			color: var(--text-secondary, #999);
		}
	}
}
</style>

