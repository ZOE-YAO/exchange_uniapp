<template>
	<view class="currency-item" @click="handleClick">
		<view class="currency-left">
			<text class="currency-flag">{{ currency.flag }}</text>
			<view class="currency-info">
				<text class="currency-code">{{ currency.code }}</text>
				<text class="currency-name">{{ currency.name }}</text>
			</view>
		</view>
		<view class="currency-right">
			<view class="checkbox" :class="{ 'checkbox-checked': selected }">
				<text class="checkbox-icon" v-if="selected">✓</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	currency: {
		type: Object,
		required: true
	},
	selected: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['click'])

const handleClick = () => {
	emit('click', props.currency.code)
}
</script>

<style lang="scss" scoped>
.currency-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 32rpx;
	background: var(--bg-card, #ffffff);
	border-bottom: 1rpx solid var(--border-color, #f0f0f0);
	transition: background 0.2s;
	
	&:active {
		background: var(--bg-active, #f5f5f5);
	}
	
	.currency-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
		flex: 1;
		
		.currency-flag {
			font-size: 48rpx;
			line-height: 1;
		}
		
		.currency-info {
			display: flex;
			flex-direction: column;
			
			.currency-code {
				font-size: 30rpx;
				font-weight: 600;
				color: var(--text-primary, #333);
				line-height: 1.3;
			}
			
			.currency-name {
				font-size: 24rpx;
				color: var(--text-secondary, #999);
				margin-top: 4rpx;
			}
		}
	}
	
	.currency-right {
		.checkbox {
			width: 44rpx;
			height: 44rpx;
			border: 2rpx solid var(--border-color, #d1d1d6);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s;
			
			&.checkbox-checked {
				background: var(--color-primary, #007AFF);
				border-color: var(--color-primary, #007AFF);
				
				.checkbox-icon {
					font-size: 28rpx;
					color: #fff;
					font-weight: 600;
				}
			}
		}
	}
}
</style>

