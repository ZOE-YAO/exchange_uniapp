/**
 * 网络请求封装
 */

const BASE_TIMEOUT = 10000 // 10秒超时

/**
 * 统一请求方法
 * @param {object} options - 请求配置
 * @returns {Promise}
 */
export const request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: options.header || {
				'Content-Type': 'application/json'
			},
			timeout: options.timeout || BASE_TIMEOUT,
			success: (res) => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data)
				} else {
					reject(new Error(`HTTP Error: ${res.statusCode}`))
				}
			},
			fail: (err) => {
				console.error('请求失败:', err)
				reject(err)
			}
		})
	})
}

/**
 * GET 请求
 */
export const get = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'GET',
		data,
		...options
	})
}

/**
 * POST 请求
 */
export const post = (url, data = {}, options = {}) => {
	return request({
		url,
		method: 'POST',
		data,
		...options
	})
}

export default {
	request,
	get,
	post
}

