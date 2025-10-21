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

/**
 * 格式化数值缩写（根据地区习惯）
 * @param {string|number} value - 数值
 * @param {string} locale - 地区代码，默认 'zh-CN'
 * @returns {string} 缩写
 */
export const formatNumberAbbr = (value, locale = 'zh-CN') => {
	if (!value || value === '0' || value === '') return ''
	
	const num = parseFloat(value)
	if (isNaN(num) || num === 0) return ''
	
	const absNum = Math.abs(num)
	
	// 小于1000，不显示缩写
	if (absNum < 1000) return ''
	
	// 中文地区（中国、台湾、香港）：千、万、亿
	if (locale === 'zh-CN' || locale === 'zh-TW' || locale === 'zh-HK') {
		if (absNum >= 100000000) {
			const yi = absNum / 100000000
			return yi >= 10 ? `${Math.floor(yi)}亿` : `${yi.toFixed(1)}亿`
		}
		if (absNum >= 10000) {
			const wan = absNum / 10000
			return wan >= 10 ? `${Math.floor(wan)}万` : `${wan.toFixed(1)}万`
		}
		if (absNum >= 1000) {
			const qian = absNum / 1000
			return qian >= 10 ? `${Math.floor(qian)}千` : `${qian.toFixed(1)}千`
		}
	}
	// 日本、韩国：百、千、万、亿
	else if (locale === 'ja-JP' || locale === 'ko-KR') {
		if (absNum >= 100000000) {
			const oku = absNum / 100000000
			return oku >= 10 ? `${Math.floor(oku)}億` : `${oku.toFixed(1)}億`
		}
		if (absNum >= 10000) {
			const man = absNum / 10000
			return man >= 10 ? `${Math.floor(man)}万` : `${man.toFixed(1)}万`
		}
		if (absNum >= 1000) {
			const sen = absNum / 1000
			return sen >= 10 ? `${Math.floor(sen)}千` : `${sen.toFixed(1)}千`
		}
		if (absNum >= 100) {
			const hyaku = absNum / 100
			return hyaku >= 10 ? `${Math.floor(hyaku)}百` : `${hyaku.toFixed(1)}百`
		}
	}
	// 英语地区：K (千), M (百万), B (十亿), T (万亿)
	else if (locale.startsWith('en')) {
		if (absNum >= 1000000000000) { // Trillion
			const t = absNum / 1000000000000
			return t >= 10 ? `${Math.floor(t)}T` : `${t.toFixed(1)}T`
		}
		if (absNum >= 1000000000) { // Billion
			const b = absNum / 1000000000
			return b >= 10 ? `${Math.floor(b)}B` : `${b.toFixed(1)}B`
		}
		if (absNum >= 1000000) { // Million
			const m = absNum / 1000000
			return m >= 10 ? `${Math.floor(m)}M` : `${m.toFixed(1)}M`
		}
		if (absNum >= 1000) { // Thousand
			const k = absNum / 1000
			return k >= 10 ? `${Math.floor(k)}K` : `${k.toFixed(1)}K`
		}
	}
	// 印度地区：L (十万 Lakh), Cr (千万 Crore)
	else if (locale === 'en-IN' || locale === 'hi-IN') {
		if (absNum >= 10000000) { // Crore
			const cr = absNum / 10000000
			return cr >= 10 ? `${Math.floor(cr)}Cr` : `${cr.toFixed(1)}Cr`
		}
		if (absNum >= 100000) { // Lakh
			const l = absNum / 100000
			return l >= 10 ? `${Math.floor(l)}L` : `${l.toFixed(1)}L`
		}
		if (absNum >= 1000) { // Thousand
			const k = absNum / 1000
			return k >= 10 ? `${Math.floor(k)}K` : `${k.toFixed(1)}K`
		}
	}
	// 其他地区默认使用 K, M, B, T
	else {
		if (absNum >= 1000000000) {
			const b = absNum / 1000000000
			return b >= 10 ? `${Math.floor(b)}B` : `${b.toFixed(1)}B`
		}
		if (absNum >= 1000000) {
			const m = absNum / 1000000
			return m >= 10 ? `${Math.floor(m)}M` : `${m.toFixed(1)}M`
		}
		if (absNum >= 1000) {
			const k = absNum / 1000
			return k >= 10 ? `${Math.floor(k)}K` : `${k.toFixed(1)}K`
		}
	}
	
	return ''
}

