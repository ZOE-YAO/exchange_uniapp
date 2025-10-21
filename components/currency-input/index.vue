<template>
	<view 
		class="currency-card" 
		:class="{ 'card-active': isActive }"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
		@touchend="handleTouchEnd"
		@longpress="handleLongPress"
	>
		<!-- 顶部一行：国旗、货币名称、汇率 -->
		<view class="card-header">
			<view class="currency-basic">
				<text class="currency-flag">{{ currencyInfo.flag }}</text>
			<view class="currency-names">
				<text class="currency-name-only" :class="{ 'text-fade': hasValue }">{{ currencyInfo.name }}</text>
				<text class="currency-divider" :class="{ 'text-fade': hasValue }">｜</text>
				<text class="currency-code-text" :class="{ 'text-fade': hasValue }">{{ currencyInfo.code }}</text>
			</view>
			</view>
			<view class="rate-display" v-if="rateDisplay">
				<text class="rate-text" :class="{ 'text-fade': hasValue }">{{ rateDisplay }}</text>
			</view>
		</view>
		
		<!-- 输入框 -->
		<view class="amount-input">
			<text class="currency-symbol">{{ currencyInfo.symbol }}</text>
			<text class="amount-value" :class="{ 'amount-zero': !amount || amount === '0', 'amount-active': isActive && !isEditing, 'amount-editing': isShowingOldValue, 'amount-new-input': isEditing && !isShowingOldValue }">
				{{ displayAmount }}
			</text>
			<text class="amount-abbr" v-if="amountAbbr">{{ amountAbbr }}</text>
		</view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatNumberAbbr } from '@/utils/format'

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
	isShowingOldValue: {
		type: Boolean,
		default: false
	},
	showDelete: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['focus', 'delete', 'longpress'])

// 手势处理状态
const touchStartTime = ref(0)
const touchStartPos = ref({ x: 0, y: 0 })
const isTouchMoved = ref(false)
const longPressTimer = ref(null)
const MOVE_THRESHOLD = 10 // 移动阈值，超过此值认为是滑动
const LONG_PRESS_DURATION = 600 // 长按时间阈值

// 显示格式化的金额
const displayAmount = computed(() => {
	// 如果没有金额或为0，显示 0
	if (!props.amount || props.amount === '0' || props.amount === '') {
		return '0'
	}
	return props.amount
})

// 数值缩写
const amountAbbr = computed(() => {
	// 需要移除千分位分隔符后再计算
	if (!props.amount || props.amount === '0' || props.amount === '') return ''
	const cleanAmount = props.amount.replace(/,/g, '')
	return formatNumberAbbr(cleanAmount)
})

// 是否有数值
const hasValue = computed(() => {
	return props.amount && props.amount !== '0' && props.amount !== ''
})

// 点击卡片聚焦
const handleFocus = () => {
	emit('focus', props.currencyInfo.code)
}

// 删除币种
const handleDelete = () => {
	emit('delete', props.currencyInfo.code)
}

// 长按（只在没有滑动时触发）
const handleLongPress = () => {
	if (!isTouchMoved.value) {
		emit('longpress', props.currencyInfo.code)
	}
}

// 触摸开始
const handleTouchStart = (e) => {
	touchStartTime.value = Date.now()
	isTouchMoved.value = false
	
	const touch = e.touches[0]
	touchStartPos.value = {
		x: touch.pageX,
		y: touch.pageY
	}
	
	// 清除之前的长按定时器
	if (longPressTimer.value) {
		clearTimeout(longPressTimer.value)
		longPressTimer.value = null
	}
}

// 触摸移动
const handleTouchMove = (e) => {
	if (isTouchMoved.value) return
	
	const touch = e.touches[0]
	const deltaX = Math.abs(touch.pageX - touchStartPos.value.x)
	const deltaY = Math.abs(touch.pageY - touchStartPos.value.y)
	
	// 如果移动距离超过阈值，标记为滑动
	if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
		isTouchMoved.value = true
		
		// 取消长按定时器
		if (longPressTimer.value) {
			clearTimeout(longPressTimer.value)
			longPressTimer.value = null
		}
	}
}

// 触摸结束
const handleTouchEnd = (e) => {
	const touchEndTime = Date.now()
	const touchDuration = touchEndTime - touchStartTime.value
	
	// 清除长按定时器
	if (longPressTimer.value) {
		clearTimeout(longPressTimer.value)
		longPressTimer.value = null
	}
	
	// 如果没有滑动且触摸时间较短，认为是点击
	if (!isTouchMoved.value && touchDuration < LONG_PRESS_DURATION) {
		handleFocus()
	}
	
	// 重置状态
	isTouchMoved.value = false
	touchStartTime.value = 0
}
</script>

<style lang="scss" scoped>
.currency-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 20rpx 24rpx;
	margin: 0 0 20rpx 0;
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
		margin-bottom: 8rpx;
		
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
				gap: 8rpx;
				
				.currency-name-only {
					font-size: 28rpx;
					font-weight: 600;
					color: #333;
					transition: color 0.3s;
					
					&.text-fade {
						color: #999;
					}
				}
				
				.currency-divider {
					font-size: 24rpx;
					color: #ddd;
					font-weight: 300;
					transition: color 0.3s;
					
					&.text-fade {
						color: #e8e8ed;
					}
				}
				
				.currency-code-text {
					font-size: 24rpx;
					font-weight: 400;
					color: #999;
					transition: color 0.3s;
					
					&.text-fade {
						color: #ccc;
					}
				}
			}
		}
		
		.rate-display {
			flex-shrink: 0;
			
			.rate-text {
				font-size: 24rpx;
				color: #999;
				font-weight: 400;
				transition: color 0.3s;
				
				&.text-fade {
					color: #ccc;
				}
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
		align-items: center;
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
			
			&.amount-editing {
				color: #999;
			}
			
			&.amount-new-input {
				color: #007AFF;
			}
		}
		
		.amount-abbr {
			font-size: 24rpx;
			color: #007AFF;
			font-weight: 600;
			flex-shrink: 0;
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

