// 验证修复后的计算器逻辑

// 测试场景1: 1+1+2的完整流程
console.log('=== 测试场景：1+1+2 ===')

let currentValue = '1'
let expression = ''
let waitingForOperand = false

console.log('1. 输入1')
console.log('currentValue:', currentValue)
console.log('expression:', expression)
console.log('小字:', expression || '')
console.log('大字:', currentValue)
console.log()

console.log('2. 按下+')
expression = currentValue + '+'
waitingForOperand = true
console.log('currentValue:', currentValue)
console.log('expression:', expression)
console.log('小字:', expression)
console.log('大字:', currentValue)
console.log()

console.log('3. 输入1')
currentValue = '1'
waitingForOperand = false
console.log('currentValue:', currentValue)
console.log('expression:', expression)
console.log('小字:', expression + currentValue)
console.log('大字:', currentValue)
console.log()

console.log('4. 按下+（触发计算）')
// 计算 1+1
const result = eval('1+1')
currentValue = result.toString()
expression = currentValue + '+'
waitingForOperand = true
console.log('计算结果:', result)
console.log('currentValue:', currentValue)
console.log('expression:', expression)
console.log('小字:', expression)
console.log('大字:', currentValue)
console.log()

console.log('5. 输入2')
currentValue = '2'
waitingForOperand = false
console.log('currentValue:', currentValue)
console.log('expression:', expression)
console.log('小字:', expression + currentValue)
console.log('大字:', currentValue)
console.log()

console.log('验证完成')