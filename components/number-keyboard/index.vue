<template>
	<view class="number-keyboard" v-if="visible">
		<view class="keyboard-mask" @click="handleHide"></view>
		<view class="keyboard-container">
			<view class="keyboard-header">
				<text class="keyboard-title">{{ title }}</text>
				<text class="keyboard-value">{{ displayValue }}</text>
			</view>
			<view class="keyboard-body">
				<!-- 第一行：运算符 -->
				<view class="keyboard-row">
					<view class="key key-operator" @click="handleOperator('+')">+</view>
					<view class="key key-operator" @click="handleOperator('-')">-</view>
					<view class="key key-operator" @click="handleOperator('×')">×</view>
					<view class="key key-operator" @click="handleOperator('%')">%</view>
				</view>
				
				<!-- 第二行：7 8 9 -->
				<view class="keyboard-row">
					<view class="key" @click="handleInput('7')">7</view>
					<view class="key" @click="handleInput('8')">8</view>
					<view class="key" @click="handleInput('9')">9</view>
				</view>
				
				<!-- 第三行：4 5 6 -->
				<view class="keyboard-row">
					<view class="key" @click="handleInput('4')">4</view>
					<view class="key" @click="handleInput('5')">5</view>
					<view class="key" @click="handleInput('6')">6</view>
				</view>
				
				<!-- 第四行：1 2 3 -->
				<view class="keyboard-row">
					<view class="key" @click="handleInput('1')">1</view>
					<view class="key" @click="handleInput('2')">2</view>
					<view class="key" @click="handleInput('3')">3</view>
				</view>
				
				<!-- 第五行：00 0 . -->
				<view class="keyboard-row">
					<view class="key" @click="handleInput('00')">00</view>
					<view class="key" @click="handleInput('0')">0</view>
					<view class="key" @click="handleInput('.')">.</view>
				</view>
				
				<!-- 第六行：隐藏 删除 清空 -->
				<view class="keyboard-row keyboard-actions">
					<view class="key key-action" @click="handleHide">隐藏</view>
					<view class="key key-action key-delete" @click="handleDelete">删除</view>
					<view class="key key-action key-clear" @click="handleClear">清空</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	},
	value: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: '输入金额'
	},
	maxLength: {
		type: Number,
		default: 16
	},
	maxDecimal: {
		type: Number,
		default: 8
	}
})

const emit = defineEmits(['update:visible', 'update:value', 'input', 'close', 'hide'])

const currentValue = ref(props.value)
const operatorMode = ref(false) // 是否进入运算模式
const firstNumber = ref('') // 第一个数字
const operator = ref('') // 运算符

watch(() => props.value, (newVal) => {
	currentValue.value = newVal
})

// 显示的值
const displayValue = computed(() => {
	if (operatorMode.value) {
		return `${firstNumber.value} ${operator.value} ${currentValue.value}`
	}
	return currentValue.value || '0'
})

// 处理数字输入
const handleInput = (key) => {
	let newValue = currentValue.value
	
	// 处理小数点
	if (key === '.') {
		if (newValue.includes('.')) return
		if (!newValue) newValue = '0'
	}
	
	// 如果有小数点，检查小数位数
	if (newValue.includes('.')) {
		const decimalPart = newValue.split('.')[1]
		if (decimalPart && decimalPart.length >= props.maxDecimal) {
			return
		}
	}
	
	// 检查最大长度
	if (newValue.length >= props.maxLength) return
	
	newValue += key
	
	// 去除开头多余的0
	if (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
		newValue = newValue.substring(1)
	}
	
	currentValue.value = newValue
	emit('update:value', newValue)
	emit('input', newValue)
}

// 处理运算符
const handleOperator = (op) => {
	if (!currentValue.value || currentValue.value === '0') return
	
	// 如果已经在运算模式，先计算之前的结果
	if (operatorMode.value && firstNumber.value) {
		calculateResult()
	}
	
	firstNumber.value = currentValue.value
	operator.value = op
	operatorMode.value = true
	currentValue.value = ''
	
	// 可以在这里触发震动反馈
	// #ifdef APP-PLUS
	uni.vibrateShort({ type: 'light' })
	// #endif
}

// 计算结果
const calculateResult = () => {
	const num1 = parseFloat(firstNumber.value)
	const num2 = parseFloat(currentValue.value)
	let result = 0
	
	switch (operator.value) {
		case '+':
			result = num1 + num2
			break
		case '-':
			result = num1 - num2
			break
		case '×':
			result = num1 * num2
			break
		case '%':
			result = num1 % num2
			break
	}
	
	// 保留合理的小数位数
	result = parseFloat(result.toFixed(8))
	currentValue.value = result.toString()
	
	operatorMode.value = false
	firstNumber.value = ''
	operator.value = ''
	
	emit('update:value', currentValue.value)
	emit('input', currentValue.value)
}

// 处理删除
const handleDelete = () => {
	if (currentValue.value) {
		currentValue.value = currentValue.value.slice(0, -1)
		emit('update:value', currentValue.value)
		emit('input', currentValue.value)
	}
}

// 清空
const handleClear = () => {
	currentValue.value = ''
	operatorMode.value = false
	firstNumber.value = ''
	operator.value = ''
	emit('update:value', '')
	emit('input', '')
}

// 隐藏键盘
const handleHide = () => {
	// 如果在运算模式，先计算结果
	if (operatorMode.value && firstNumber.value && currentValue.value) {
		calculateResult()
	}
	
	emit('update:visible', false)
	emit('hide')
	emit('close')
}
</script>

<style lang="scss" scoped>
.number-keyboard {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1000;
	
	.keyboard-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
	}
	
	.keyboard-container {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #f5f5f7;
		border-radius: 20rpx 20rpx 0 0;
		animation: slideUp 0.3s ease-out;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	
	.keyboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 20rpx 20rpx 0 0;
		
		.keyboard-title {
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.9);
			font-weight: 500;
		}
		
		.keyboard-value {
			font-size: 32rpx;
			color: #fff;
			font-weight: 600;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
		}
	}
	
	.keyboard-body {
		padding: 20rpx;
		
		.keyboard-row {
			display: flex;
			gap: 16rpx;
			margin-bottom: 16rpx;
			
			&:last-child {
				margin-bottom: 0;
			}
			
			&.keyboard-actions {
				margin-top: 8rpx;
			}
		}
		
		.key {
			flex: 1;
			height: 100rpx;
			background: #ffffff;
			border-radius: 16rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			color: #333;
			font-weight: 500;
			box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
			transition: all 0.2s;
			
			&:active {
				transform: scale(0.95);
				background: #f0f0f0;
			}
			
			&.key-operator {
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: #fff;
				font-size: 40rpx;
				font-weight: 600;
				
				&:active {
					background: linear-gradient(135deg, #5568d3 0%, #63408b 100%);
				}
			}
			
			&.key-action {
				background: #e8e8ed;
				font-size: 28rpx;
				color: #666;
				
				&:active {
					background: #d8d8dd;
				}
			}
			
			&.key-delete {
				background: #ff9500;
				color: #fff;
				
				&:active {
					background: #e68600;
				}
			}
			
			&.key-clear {
				background: #ff3b30;
				color: #fff;
				
				&:active {
					background: #e6352a;
				}
			}
		}
	}
}

@keyframes slideUp {
	from {
		transform: translateY(100%);
	}
	to {
		transform: translateY(0);
	}
}
</style>
