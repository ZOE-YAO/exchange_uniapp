/**
 * 本地存储工具类
 */

/**
 * 设置存储
 * @param {string} key 键名
 * @param {any} value 值
 */
export const setStorage = (key, value) => {
	try {
		uni.setStorageSync(key, value)
		return true
	} catch (error) {
		console.error('存储失败:', error)
		return false
	}
}

/**
 * 获取存储
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 */
export const getStorage = (key, defaultValue = null) => {
	try {
		const value = uni.getStorageSync(key)
		return value !== undefined && value !== null ? value : defaultValue
	} catch (error) {
		console.error('读取存储失败:', error)
		return defaultValue
	}
}

/**
 * 移除存储
 * @param {string} key 键名
 */
export const removeStorage = (key) => {
	try {
		uni.removeStorageSync(key)
		return true
	} catch (error) {
		console.error('删除存储失败:', error)
		return false
	}
}

/**
 * 清空所有存储
 */
export const clearStorage = () => {
	try {
		uni.clearStorageSync()
		return true
	} catch (error) {
		console.error('清空存储失败:', error)
		return false
	}
}

/**
 * 获取存储信息
 */
export const getStorageInfo = () => {
	try {
		return uni.getStorageInfoSync()
	} catch (error) {
		console.error('获取存储信息失败:', error)
		return null
	}
}

