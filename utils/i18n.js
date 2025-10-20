/**
 * 简单的国际化工具
 */

import zhCN from '@/locale/zh-CN.js'
import enUS from '@/locale/en-US.js'

const messages = {
	'zh-CN': zhCN,
	'en-US': enUS
}

let currentLocale = 'zh-CN'

/**
 * 设置当前语言
 * @param {string} locale - 语言代码
 */
export const setLocale = (locale) => {
	if (messages[locale]) {
		currentLocale = locale
	}
}

/**
 * 获取当前语言
 * @returns {string}
 */
export const getLocale = () => {
	return currentLocale
}

/**
 * 翻译函数
 * @param {string} key - 翻译键，支持点号分隔的路径，如 'common.confirm'
 * @param {object} params - 参数对象，用于替换占位符
 * @returns {string}
 */
export const t = (key, params = {}) => {
	const keys = key.split('.')
	let value = messages[currentLocale]
	
	// 逐级查找
	for (const k of keys) {
		if (value && typeof value === 'object') {
			value = value[k]
		} else {
			return key // 找不到则返回键名
		}
	}
	
	if (typeof value !== 'string') {
		return key
	}
	
	// 替换参数
	let result = value
	Object.keys(params).forEach(paramKey => {
		result = result.replace(new RegExp(`{${paramKey}}`, 'g'), params[paramKey])
	})
	
	return result
}

/**
 * 根据当前语言获取币种名称
 * @param {object} currency - 币种对象
 * @returns {string}
 */
export const getCurrencyName = (currency) => {
	if (currentLocale === 'zh-CN') {
		return currency.name || currency.nameEn
	}
	return currency.nameEn || currency.name
}

export default {
	setLocale,
	getLocale,
	t,
	getCurrencyName
}

