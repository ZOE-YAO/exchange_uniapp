<template>
	<view class="calculator-keyboard" v-if="visible">
		<view class="keyboard-mask" @click="handleHide"></view>
		<view class="keyboard-container">
			<!-- 标题栏 -->
			<view class="keyboard-header">
				<text class="keyboard-title">{{ title }}</text>
				<view class="close-btn" @click="handleHide">
					<text class="close-icon">×</text>
				</view>
			</view>
			
			<!-- 显示区域（支持表达式） -->
			<view class="display-area">
				<view class="currency-flag-left">{{ currentCurrency?.flag || '🌍' }}</view>
				<view class="display-values">
					<text class="expression-text" v-if="expression">{{ expression }}</text>
					<text class="display-value">{{ displayValue || '0' }}</text>
				</view>
			</view>
			
			<!-- 键盘主体 -->
			<view class="keyboard-body">
				<!-- 左侧：数字区域 -->
				<view class="number-area">
					<!-- 第一行：7 8 9 -->
					<view class="key-row">
						<view class="key" @click="handleInput('7')">7</view>
						<view class="key" @click="handleInput('8')">8</view>
						<view class="key" @click="handleInput('9')">9</view>
					</view>
					
					<!-- 第二行：4 5 6 -->
					<view class="key-row">
						<view class="key" @click="handleInput('4')">4</view>
						<view class="key" @click="handleInput('5')">5</view>
						<view class="key" @click="handleInput('6')">6</view>
					</view>
					
					<!-- 第三行：1 2 3 -->
					<view class="key-row">
						<view class="key" @click="handleInput('1')">1</view>
						<view class="key" @click="handleInput('2')">2</view>
						<view class="key" @click="handleInput('3')">3</view>
					</view>
					
					<!-- 第四行：00 0 . -->
					<view class="key-row">
						<view class="key" @click="handleInput('00')">00</view>
						<view class="key key-zero" @click="handleInput('0')">0</view>
						<view class="key" @click="handleInput('.')">.</view>
					</view>
					
					<!-- 第五行：← C -->
					<view class="key-row bottom-row">
						<view class="key key-function" @click="handleDelete">
							<text class="key-icon">←</text>
						</view>
						<view class="key key-function" @click="handleClear">
							<text class="key-text">清空</text>
						</view>
					</view>
				</view>
				
				<!-- 右侧：运算符区域 -->
				<view class="operator-area">
					<view class="operator-key" @click="handleOperator('+')">+</view>
					<view class="operator-key" @click="handleOperator('-')">−</view>
					<view class="operator-key" @click="handleOperator('×')">×</view>
					<view class="operator-key" @click="handleOperator('÷')">÷</view>
					<view class="operator-key operator-equal" @click="handleCalculate">=</view>
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
	currentCurrency: {
		type: Object,
		default: () => ({})
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

const currentValue = ref('')
const expression = ref('') // 当前表达式
const waitingForOperand = ref(false) // 是否等待下一个操作数

watch(() => props.value, (newVal) => {
	if (newVal !== currentValue.value) {
		currentValue.value = newVal
		expression.value = ''
	}
}, { immediate: true })

// 显示的值
const displayValue = computed(() => {
	return currentValue.value || '0'
})

// 处理数字输入
const handleInput = (key) => {
	// 如果等待新操作数，清空当前值
	if (waitingForOperand.value) {
		currentValue.value = ''
		waitingForOperand.value = false
	}
	
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
	emitValue()
}

// 处理运算符
const handleOperator = (op) => {
	if (!currentValue.value || currentValue.value === '0') return
	
	// 将当前值添加到表达式
	if (expression.value && !expression.value.endsWith(' ')) {
		// 如果表达式存在且不以空格结尾，先计算结果
		const result = evaluateExpression(expression.value + ' ' + currentValue.value)
		if (result !== null) {
			currentValue.value = result.toString()
		}
	}
	
	// 构建新表达式
	expression.value = currentValue.value + ' ' + op
	waitingForOperand.value = true
	
	// 触发震动反馈
	// #ifdef APP-PLUS
	uni.vibrateShort({ type: 'light' })
	// #endif
}

// 计算表达式结果
const evaluateExpression = (expr) => {
	try {
		// 将运算符转换为 JavaScript 可识别的
		const jsExpr = expr
			.replace(/×/g, '*')
			.replace(/÷/g, '/')
			.replace(/−/g, '-')
		
		// 使用 Function 构造器安全计算
		const result = new Function('return ' + jsExpr)()
		
		// 保留合理的小数位数
		return parseFloat(result.toFixed(8))
	} catch (error) {
		console.error('表达式计算错误:', error)
		return null
	}
}

// 点击等号，计算结果
const handleCalculate = () => {
	if (!expression.value || !currentValue.value) return
	
	const fullExpression = expression.value + ' ' + currentValue.value
	console.log('计算表达式:', fullExpression)
	
	const result = evaluateExpression(fullExpression)
	
	if (result !== null) {
		currentValue.value = result.toString()
		expression.value = '' // 清空表达式
		waitingForOperand.value = false
		emitValue()
		
		// 触发震动反馈
		// #ifdef APP-PLUS
		uni.vibrateShort({ type: 'medium' })
		// #endif
	}
}

// 处理删除
const handleDelete = () => {
	if (currentValue.value) {
		currentValue.value = currentValue.value.slice(0, -1)
		emitValue()
	}
}

// 清空
const handleClear = () => {
	currentValue.value = ''
	expression.value = ''
	waitingForOperand.value = false
	emitValue()
}

// 发送值更新
const emitValue = () => {
	emit('update:value', currentValue.value)
	emit('input', currentValue.value)
}

// 隐藏键盘
const handleHide = () => {
	// 如果有未完成的表达式，先计算
	if (expression.value && currentValue.value) {
		handleCalculate()
	}
	
	emit('update:visible', false)
	emit('hide')
	emit('close')
}
</script>

<style lang="scss" scoped>
.calculator-keyboard {
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
		background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
		border-radius: 20rpx 20rpx 0 0;
		animation: slideUp 0.3s ease-out;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.1);
	}
	
	.keyboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #e8e8ed;
		
		.keyboard-title {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
		}
		
		.close-btn {
			width: 48rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.close-icon {
				font-size: 48rpx;
				color: #999;
				line-height: 1;
			}
		}
	}
	
	.display-area {
		padding: 24rpx 32rpx;
		background: #fff;
		border-bottom: 1rpx solid #e8e8ed;
		display: flex;
		align-items: center;
		gap: 20rpx;
		
		.currency-flag-left {
			font-size: 56rpx;
			line-height: 1;
			flex-shrink: 0;
		}
		
		.display-values {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			justify-content: center;
			min-height: 80rpx;
			
			.expression-text {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 8rpx;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
			}
			
			.display-value {
				font-size: 48rpx;
				font-weight: 600;
				color: #333;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
			}
		}
	}
	
	.keyboard-body {
		display: flex;
		padding: 20rpx;
		gap: 16rpx;
		
		.number-area {
			flex: 1;
			
			.key-row {
				display: flex;
				gap: 16rpx;
				margin-bottom: 16rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				&.bottom-row {
					.key {
						flex: 1;
					}
				}
			}
			
			.key {
				flex: 1;
				height: 100rpx;
				background: #fff;
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 40rpx;
				color: #333;
				font-weight: 500;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
				transition: all 0.2s;
				
				&:active {
					transform: scale(0.95);
					background: #f0f0f0;
				}
				
				&.key-zero {
					flex: 2;
				}
				
				&.key-function {
					background: #e8e8ed;
					font-size: 32rpx;
					
					.key-icon {
						font-size: 36rpx;
					}
					
					.key-text {
						font-size: 28rpx;
						color: #666;
					}
					
					&:active {
						background: #d8d8dd;
					}
				}
			}
		}
		
		.operator-area {
			width: 100rpx;
			display: flex;
			flex-direction: column;
			gap: 16rpx;
			
			.operator-key {
				flex: 1;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 40rpx;
				color: #fff;
				font-weight: 600;
				box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
				transition: all 0.2s;
				
				&:active {
					transform: scale(0.95);
					box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
				}
				
				&.operator-equal {
					background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
					box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.3);
					
					&:active {
						box-shadow: 0 2rpx 8rpx rgba(245, 87, 108, 0.2);
					}
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

