<template>
	<view class="calculator-keyboard" v-if="visible">
		<view class="keyboard-mask" @click="handleHide"></view>
		<view class="keyboard-container" :class="{ 'shake': isShaking }">
			<!-- 显示区域（支持表达式） -->
			<view class="display-area">
				<view class="currency-flag-left">{{ currentCurrency?.flag || '🌍' }}</view>
				<view class="display-values">
					<text class="expression-text" v-if="fullExpression">{{ fullExpression }}</text>
					<text class="display-value">{{ displayValue || '0' }}</text>
				</view>
			</view>
			
			<!-- 键盘主体 -->
			<view class="keyboard-body">
				<!-- 数字和运算符区域 -->
				<view class="main-area">
					<!-- 第一行：7 8 9 + -->
					<view class="key-row">
						<view class="key" @click="handleInput('7')">7</view>
						<view class="key" @click="handleInput('8')">8</view>
						<view class="key" @click="handleInput('9')">9</view>
						<view class="key key-operator" @click="handleOperator('+')">+</view>
					</view>
					
					<!-- 第二行：4 5 6 - -->
					<view class="key-row">
						<view class="key" @click="handleInput('4')">4</view>
						<view class="key" @click="handleInput('5')">5</view>
						<view class="key" @click="handleInput('6')">6</view>
						<view class="key key-operator" @click="handleOperator('-')">−</view>
					</view>
					
					<!-- 第三行：1 2 3 × -->
					<view class="key-row">
						<view class="key" @click="handleInput('1')">1</view>
						<view class="key" @click="handleInput('2')">2</view>
						<view class="key" @click="handleInput('3')">3</view>
						<view class="key key-operator" @click="handleOperator('×')">×</view>
					</view>
					
					<!-- 第四行：00 0 . ÷ -->
					<view class="key-row">
						<view class="key" @click="handleInput('00')">00</view>
						<view class="key" @click="handleInput('0')">0</view>
						<view class="key" @click="handleInput('.')">.</view>
						<view class="key key-operator" @click="handleOperator('÷')">÷</view>
					</view>
					
					<!-- 底部一排：关闭、清空、删除、等于 -->
					<view class="key-row bottom-row">
						<view class="key key-close" @click="handleHide">
							<text class="key-text">关闭</text>
						</view>
						<view class="key key-clear" @click="handleClear">
							<text class="key-text">清空</text>
						</view>
						<view class="key key-delete" @click="handleDelete">
							<text class="key-icon">←</text>
						</view>
						<view class="key key-equal" @click="handleCalculate">=</view>
					</view>
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
	allCurrencies: {
		type: Array,
		default: () => []
	},
	baseCurrency: {
		type: String,
		default: 'CNY'
	},
	rates: {
		type: Object,
		default: () => ({})
	},
	maxLength: {
		type: Number,
		default: 16
	},
	maxValue: {
		type: Number,
		default: 1000000000000 // 万亿
	},
	maxDecimal: {
		type: Number,
		default: 2
	}
})

const emit = defineEmits(['update:visible', 'update:value', 'input', 'close', 'hide'])

const currentValue = ref('')
const expression = ref('') // 当前表达式
const waitingForOperand = ref(false) // 是否等待下一个操作数
const isShaking = ref(false) // 微动效状态

// 检查是否有其他币种会超过上限
const checkOtherCurrenciesLimit = (inputValue) => {
	if (!props.currentCurrency?.code || !props.rates || !props.allCurrencies?.length) {
		return false
	}
	
	const numValue = parseFloat(inputValue)
	if (isNaN(numValue)) return false
	
	// 获取当前货币的汇率
	const currentCode = props.currentCurrency.code
	const currentRate = props.rates[currentCode] || 1
	
	// 检查每个其他货币
	for (const currency of props.allCurrencies) {
		if (currency.code === currentCode) continue
		
		const targetRate = props.rates[currency.code] || 1
		const convertedValue = numValue * (targetRate / currentRate)
		
		if (convertedValue > props.maxValue) {
			return true
		}
	}
	
	return false
}

// 触发微动效
const triggerShake = () => {
	isShaking.value = true
	// 震动反馈
	// #ifdef APP-PLUS
	uni.vibrateShort({ type: 'heavy' })
	// #endif
	setTimeout(() => {
		isShaking.value = false
	}, 300)
}

watch(() => props.value, (newVal) => {
	if (newVal !== currentValue.value) {
		currentValue.value = newVal
		expression.value = ''
	}
}, { immediate: true })

// 监听 displayValue 变化，实时更新到父组件
watch(() => displayValue.value, (newDisplayValue) => {
	// 实时同步显示值到父组件
	emit('update:value', newDisplayValue)
	emit('input', newDisplayValue)
})

// 完整表达式（用于小字显示）- 显示实际输入内容
const fullExpression = computed(() => {
	// 如果只有当前值，没有表达式，不显示小字（只显示输入的数字）
	if (!expression.value) {
		return ''
	}
	
	// 如果正在等待输入操作数，只显示表达式（带运算符）
	if (waitingForOperand.value) {
		return expression.value
	}
	
	// 如果有表达式，显示完整的表达式+当前输入的值
	return expression.value + (currentValue.value || '')
})

// 显示值（用于大字显示）
const displayValue = computed(() => {
	// 如果没有任何输入，显示0
	if (!currentValue.value && !expression.value) {
		return '0'
	}
	
	// 直接显示当前输入的值
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
	
	// 如果当前值是 '0' 或空，且输入的不是小数点，则直接替换（从头开始输入）
	if ((newValue === '0' || newValue === '') && key !== '.') {
		// 输入0时触发抖动
		if (key === '0' || key === '00') {
			triggerShake()
			return
		}
		newValue = key
		currentValue.value = newValue
		emitValue()
		return
	}
	
	// 处理小数点
	if (key === '.') {
		if (newValue.includes('.')) {
			triggerShake() // 已有小数点时抖动
			return
		}
		if (!newValue) newValue = '0'
	}
	
	// 如果有小数点，限制小数位数
	if (newValue.includes('.')) {
		const decimalPart = newValue.split('.')[1]
		if (decimalPart && decimalPart.length >= props.maxDecimal) {
			triggerShake() // 小数位达到上限时抖动
			return
		}
	}
	
	// 检查最大长度
	if (newValue.length >= props.maxLength) {
		triggerShake() // 长度达到上限时抖动
		return
	}
	
	newValue += key
	
	// 检查是否超过最大值
	const numValue = parseFloat(newValue)
	if (!isNaN(numValue) && numValue > props.maxValue) {
		triggerShake()
		return
	}
	
	// 检查其他币种是否会超过上限
	if (checkOtherCurrenciesLimit(newValue)) {
		triggerShake()
		return
	}
	
	// 去除开头多余的0（如果后面不是小数点）
	while (newValue.length > 1 && newValue[0] === '0' && newValue[1] !== '.') {
		newValue = newValue.substring(1)
	}
	
	currentValue.value = newValue
	emitValue()
}

// 处理运算符
const handleOperator = (op) => {
	if (!currentValue.value || currentValue.value === '0') {
		triggerShake() // 没有输入数字时抖动
		return
	}
	
	// 如果表达式为空，开始新表达式
	if (!expression.value) {
		expression.value = currentValue.value + op
		waitingForOperand.value = true
	} else {
		// 如果还在等待输入操作数（刚输入了运算符），则替换运算符
		if (waitingForOperand.value) {
			// 替换最后一个运算符
			expression.value = expression.value.slice(0, -1) + op
		} else {
			// 如果表达式已存在且有新的操作数，先计算前面的结果
			const fullExpr = expression.value + currentValue.value
			const result = evaluateExpression(fullExpr)
			if (result !== null && !isNaN(result)) {
				// 用计算结果作为新的当前值，并开始新的表达式
				currentValue.value = result.toString()
				expression.value = currentValue.value + op
				waitingForOperand.value = true
				// 立即同步计算结果到父组件
				emitValue()
			}
		}
	}
	
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
		
		// 保留2位小数
		return parseFloat(result.toFixed(2))
	} catch (error) {
		console.error('表达式计算错误:', error)
		return null
	}
}

// 点击等号，计算结果
const handleCalculate = () => {
	if (!expression.value || !currentValue.value) return
	
	const fullExpressionText = expression.value + currentValue.value
	console.log('计算表达式:', fullExpressionText)
	
	const result = evaluateExpression(fullExpressionText)
	
	if (result !== null) {
		// 计算完成后，清空表达式，保留结果
		currentValue.value = result.toString()
		expression.value = ''
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
	// 如果等待操作数状态，删除表达式的最后一个字符（运算符）
	if (waitingForOperand.value && expression.value) {
		expression.value = expression.value.slice(0, -1)
		if (!expression.value) {
			waitingForOperand.value = false
		}
		return
	}
	
	// 否则删除当前值的最后一个字符
	if (currentValue.value) {
		currentValue.value = currentValue.value.slice(0, -1)
		// 如果删除完了，不要设为0，保持空字符串
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
	// 发送显示值给父组件
	const valueToEmit = displayValue.value
	emit('update:value', valueToEmit)
	emit('input', valueToEmit)
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
		background-color: transparent;
	}
	
	.keyboard-container {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 24rpx 24rpx 0 0;
		animation: slideUp 0.3s ease-out;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.15), 0 -2rpx 8rpx rgba(0, 0, 0, 0.08);
		
		&.shake {
			animation: shake 0.3s ease-in-out;
		}
	}
	
	.display-area {
		padding: 24rpx 32rpx 20rpx;
		background: #ffffff;
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
			min-height: 60rpx;
			
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
		padding: 20rpx;
		
		.main-area {
			.key-row {
				display: flex;
				gap: 12rpx;
				margin-bottom: 12rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				&.bottom-row {
					.key {
						flex: 1;
						
						&.key-close {
							flex: 0.8; // 关闭按钮缩小
						}
						
						&.key-clear {
							flex: 1.4; // 清空按钮稍宽
						}
						
						&.key-delete {
							flex: 0.8; // 删除按钮缩小
						}
						
						&.key-equal {
							flex: 1; // 等于按钮标准宽度
						}
					}
				}
			}
			
			.key {
				flex: 1;
				height: 96rpx;
				background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
				border-radius: 18rpx;
				border: 1rpx solid rgba(0, 0, 0, 0.04);
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 40rpx;
				color: #1e293b;
				font-weight: 500;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08), 0 1rpx 3rpx rgba(0, 0, 0, 0.04);
				transition: all 0.2s;
				
				&:active {
					transform: scale(0.95);
					background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
					box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
				}
				
				&.key-operator {
					background: #f5f5f5;
					color: #666;
					font-weight: 600;
					border: 1rpx solid #e0e0e0;
					
					&:active {
						background: #e8e8e8;
					}
				}
				
				&.key-close {
					background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
					border: 1rpx solid rgba(148, 163, 184, 0.2);
					
					.key-text {
						font-size: 24rpx;
						color: #64748b;
					}
					
					&:active {
						background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%);
					}
				}
				
				&.key-clear {
					background: #e3f2fd;
					color: #1976d2;
					border: 1rpx solid #bbdefb;
					
					.key-text {
						font-size: 26rpx;
						color: #1976d2;
						font-weight: 600;
					}
					
					&:active {
						background: #d1e7ff;
					}
				}
				
				&.key-delete {
					background: linear-gradient(145deg, #f1f5f9 0%, #e2e8f0 100%);
					border: 1rpx solid rgba(148, 163, 184, 0.2);
					
					.key-icon {
						font-size: 32rpx;
						color: #64748b;
					}
					
					&:active {
						background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%);
					}
				}
				
				&.key-equal {
					background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
					color: #fff;
					font-weight: 600;
					box-shadow: 0 6rpx 16rpx rgba(25, 118, 210, 0.3), 0 2rpx 4rpx rgba(25, 118, 210, 0.2);
					border: 1rpx solid rgba(21, 101, 192, 0.2);
					
					&:active {
						background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
						box-shadow: 0 3rpx 8rpx rgba(25, 118, 210, 0.4);
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

@keyframes shake {
	0%, 100% {
		transform: translateX(0);
	}
	25% {
		transform: translateX(-4rpx);
	}
	75% {
		transform: translateX(4rpx);
	}
}
</style>

