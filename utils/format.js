/**
 * 格式化工具类
 */

/**
 * 格式化数字（添加千分位）
 * @param {number|string} num - 数字
 * @param {string} separator - 分隔符
 * @returns {string}
 */
export const formatNumber = (num, separator = ',') => {
	if (!num && num !== 0) return ''
	
	const parts = num.toString().split('.')
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
	
	return parts.join('.')
}

/**
 * 格式化日期时间
 * @param {number|Date} timestamp - 时间戳或日期对象
 * @param {string} format - 格式字符串
 * @returns {string}
 */
export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
	const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
	
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	
	return format
		.replace('YYYY', year)
		.replace('MM', month)
		.replace('DD', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('ss', seconds)
}

/**
 * 格式化相对时间
 * @param {number} timestamp - 时间戳
 * @returns {string} 如: "刚刚", "5分钟前", "2小时前"
 */
export const formatRelativeTime = (timestamp) => {
	if (!timestamp) return '未知'
	
	const now = Date.now()
	const diff = now - timestamp
	
	const seconds = Math.floor(diff / 1000)
	if (seconds < 60) return '刚刚'
	
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) return `${minutes}分钟前`
	
	const hours = Math.floor(minutes / 60)
	if (hours < 24) return `${hours}小时前`
	
	const days = Math.floor(hours / 24)
	if (days < 30) return `${days}天前`
	
	const months = Math.floor(days / 30)
	if (months < 12) return `${months}个月前`
	
	const years = Math.floor(months / 12)
	return `${years}年前`
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 如: "1.5 MB"
 */
export const formatFileSize = (bytes) => {
	if (bytes === 0) return '0 B'
	
	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 截断字符串
 * @param {string} str - 字符串
 * @param {number} length - 长度
 * @param {string} suffix - 后缀
 * @returns {string}
 */
export const truncate = (str, length = 20, suffix = '...') => {
	if (!str) return ''
	if (str.length <= length) return str
	
	return str.substring(0, length) + suffix
}

