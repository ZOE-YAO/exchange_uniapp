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
		default: 1000000000000000 // 百万亿（千万亿）
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
	uni.vibrateShort({ type: 'heavy' })
	setTimeout(() => {
		isShaking.value = false
	}, 500)
}

watch(() => props.value, (newVal) => {
	if (newVal !== currentValue.value) {
		currentValue.value = newVal
		expression.value = ''
	}
}, { immediate: true })

// 完整表达式（用于小字显示）- 显示实际输入内容
const fullExpression = computed(() => {
	if (!expression.value) {
		return '' // 没有表达式时不显示
	}
	// 如果正在等待输入操作数，只显示表达式（带运算符）
	if (waitingForOperand.value) {
		return expression.value
	}
	// 否则显示表达式+当前输入的值
	return expression.value + (currentValue.value || '')
})

// 实时计算结果（用于大字显示）
const displayValue = computed(() => {
	// 如果有表达式且有当前值，计算实时结果
	if (expression.value && currentValue.value && currentValue.value !== '0') {
		const fullExpr = expression.value + currentValue.value
		const result = evaluateExpression(fullExpr)
		if (result !== null) {
			return result.toString()
		}
	}
	// 否则显示当前输入的值
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
		newValue = key
		currentValue.value = newValue
		emitValue()
		return
	}
	
	// 处理小数点
	if (key === '.') {
		if (newValue.includes('.')) return
		if (!newValue) newValue = '0'
	}
	
	// 如果有小数点，限制最多2位小数
	if (newValue.includes('.')) {
		const decimalPart = newValue.split('.')[1]
		if (decimalPart && decimalPart.length >= 2) {
			return
		}
	}
	
	// 检查最大长度
	if (newValue.length >= props.maxLength) return
	
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
	if (!currentValue.value || currentValue.value === '0') return
	
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
			// 如果表达式已存在且有新的操作数，先计算当前结果，然后添加新运算符
			const fullExpr = expression.value + currentValue.value
			const result = evaluateExpression(fullExpr)
			if (result !== null) {
				currentValue.value = result.toString()
				expression.value = currentValue.value + op
				waitingForOperand.value = true
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
	
	const fullExpression = expression.value + currentValue.value
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
		background-color: transparent;
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
		
		&.shake {
			animation: shake 0.5s ease-in-out;
		}
	}
	
	.display-area {
		padding: 24rpx 32rpx 20rpx;
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
				
				&.key-operator {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: #fff;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
					
					&:active {
						background: linear-gradient(135deg, #556dd9 0%, #653a91 100%);
						box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
					}
				}
				
				&.key-close {
					background: #e8e8ed;
					
					.key-text {
						font-size: 24rpx;
						color: #666;
					}
					
					&:active {
						background: #d8d8dd;
					}
				}
				
				&.key-clear {
					background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
					box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.3);
					
					.key-text {
						font-size: 26rpx;
						color: #fff;
						font-weight: 600;
					}
					
					&:active {
						background: linear-gradient(135deg, #e082ea 0%, #e4465b 100%);
						box-shadow: 0 2rpx 8rpx rgba(245, 87, 108, 0.2);
					}
				}
				
				&.key-delete {
					background: #e8e8ed;
					
					.key-icon {
						font-size: 32rpx;
						color: #666;
					}
					
					&:active {
						background: #d8d8dd;
					}
				}
				
				&.key-equal {
					background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
					color: #fff;
					font-weight: 600;
					box-shadow: 0 4rpx 12rpx rgba(67, 233, 123, 0.3);
					
					&:active {
						background: linear-gradient(135deg, #32d86a 0%, #27e8c6 100%);
						box-shadow: 0 2rpx 8rpx rgba(67, 233, 123, 0.2);
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
	10%, 30%, 50%, 70%, 90% {
		transform: translateX(-8rpx);
	}
	20%, 40%, 60%, 80% {
		transform: translateX(8rpx);
	}
}
</style>

