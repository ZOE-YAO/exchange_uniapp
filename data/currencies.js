/**
 * 币种基础信息数据
 * 包含 150+ 全球主流货币
 */

export const currencyList = [
	// 常用货币
	{ code: 'CNY', symbol: '¥', name: '人民币', nameEn: 'Chinese Yuan', flag: '🇨🇳', popular: true },
	{ code: 'USD', symbol: '$', name: '美元', nameEn: 'US Dollar', flag: '🇺🇸', popular: true },
	{ code: 'EUR', symbol: '€', name: '欧元', nameEn: 'Euro', flag: '🇪🇺', popular: true },
	{ code: 'GBP', symbol: '£', name: '英镑', nameEn: 'British Pound', flag: '🇬🇧', popular: true },
	{ code: 'JPY', symbol: '¥', name: '日元', nameEn: 'Japanese Yen', flag: '🇯🇵', popular: true },
	{ code: 'HKD', symbol: 'HK$', name: '港币', nameEn: 'Hong Kong Dollar', flag: '🇭🇰', popular: true },
	{ code: 'AUD', symbol: 'A$', name: '澳元', nameEn: 'Australian Dollar', flag: '🇦🇺', popular: true },
	{ code: 'CAD', symbol: 'C$', name: '加元', nameEn: 'Canadian Dollar', flag: '🇨🇦', popular: true },
	{ code: 'CHF', symbol: 'Fr', name: '瑞士法郎', nameEn: 'Swiss Franc', flag: '🇨🇭', popular: true },
	{ code: 'SGD', symbol: 'S$', name: '新元', nameEn: 'Singapore Dollar', flag: '🇸🇬', popular: true },
	{ code: 'KRW', symbol: '₩', name: '韩元', nameEn: 'South Korean Won', flag: '🇰🇷', popular: true },
	{ code: 'TWD', symbol: 'NT$', name: '新台币', nameEn: 'Taiwan Dollar', flag: '🇹🇼', popular: true },
	{ code: 'THB', symbol: '฿', name: '泰铢', nameEn: 'Thai Baht', flag: '🇹🇭', popular: true },
	{ code: 'NZD', symbol: 'NZ$', name: '新西兰元', nameEn: 'New Zealand Dollar', flag: '🇳🇿', popular: true },
	
	// 亚洲货币
	{ code: 'INR', symbol: '₹', name: '印度卢比', nameEn: 'Indian Rupee', flag: '🇮🇳', popular: false },
	{ code: 'IDR', symbol: 'Rp', name: '印尼盾', nameEn: 'Indonesian Rupiah', flag: '🇮🇩', popular: false },
	{ code: 'MYR', symbol: 'RM', name: '林吉特', nameEn: 'Malaysian Ringgit', flag: '🇲🇾', popular: false },
	{ code: 'PHP', symbol: '₱', name: '菲律宾比索', nameEn: 'Philippine Peso', flag: '🇵🇭', popular: false },
	{ code: 'VND', symbol: '₫', name: '越南盾', nameEn: 'Vietnamese Dong', flag: '🇻🇳', popular: false },
	{ code: 'PKR', symbol: '₨', name: '巴基斯坦卢比', nameEn: 'Pakistani Rupee', flag: '🇵🇰', popular: false },
	{ code: 'BDT', symbol: '৳', name: '孟加拉塔卡', nameEn: 'Bangladeshi Taka', flag: '🇧🇩', popular: false },
	{ code: 'LKR', symbol: 'Rs', name: '斯里兰卡卢比', nameEn: 'Sri Lankan Rupee', flag: '🇱🇰', popular: false },
	{ code: 'MMK', symbol: 'K', name: '缅甸元', nameEn: 'Myanmar Kyat', flag: '🇲🇲', popular: false },
	{ code: 'KHR', symbol: '៛', name: '柬埔寨瑞尔', nameEn: 'Cambodian Riel', flag: '🇰🇭', popular: false },
	{ code: 'LAK', symbol: '₭', name: '老挝基普', nameEn: 'Lao Kip', flag: '🇱🇦', popular: false },
	{ code: 'BND', symbol: 'B$', name: '文莱元', nameEn: 'Brunei Dollar', flag: '🇧🇳', popular: false },
	{ code: 'MOP', symbol: 'MOP$', name: '澳门币', nameEn: 'Macanese Pataca', flag: '🇲🇴', popular: false },
	{ code: 'NPR', symbol: 'Rs', name: '尼泊尔卢比', nameEn: 'Nepalese Rupee', flag: '🇳🇵', popular: false },
	
	// 中东货币
	{ code: 'AED', symbol: 'د.إ', name: '阿联酋迪拉姆', nameEn: 'UAE Dirham', flag: '🇦🇪', popular: false },
	{ code: 'SAR', symbol: 'ر.س', name: '沙特里亚尔', nameEn: 'Saudi Riyal', flag: '🇸🇦', popular: false },
	{ code: 'QAR', symbol: 'ر.ق', name: '卡塔尔里亚尔', nameEn: 'Qatari Riyal', flag: '🇶🇦', popular: false },
	{ code: 'KWD', symbol: 'د.ك', name: '科威特第纳尔', nameEn: 'Kuwaiti Dinar', flag: '🇰🇼', popular: false },
	{ code: 'BHD', symbol: 'د.ب', name: '巴林第纳尔', nameEn: 'Bahraini Dinar', flag: '🇧🇭', popular: false },
	{ code: 'OMR', symbol: 'ر.ع.', name: '阿曼里亚尔', nameEn: 'Omani Rial', flag: '🇴🇲', popular: false },
	{ code: 'JOD', symbol: 'د.ا', name: '约旦第纳尔', nameEn: 'Jordanian Dinar', flag: '🇯🇴', popular: false },
	{ code: 'ILS', symbol: '₪', name: '以色列新谢克尔', nameEn: 'Israeli Shekel', flag: '🇮🇱', popular: false },
	{ code: 'TRY', symbol: '₺', name: '土耳其里拉', nameEn: 'Turkish Lira', flag: '🇹🇷', popular: false },
	{ code: 'IRR', symbol: '﷼', name: '伊朗里亚尔', nameEn: 'Iranian Rial', flag: '🇮🇷', popular: false },
	{ code: 'IQD', symbol: 'ع.د', name: '伊拉克第纳尔', nameEn: 'Iraqi Dinar', flag: '🇮🇶', popular: false },
	{ code: 'LBP', symbol: 'ل.ل', name: '黎巴嫩镑', nameEn: 'Lebanese Pound', flag: '🇱🇧', popular: false },
	
	// 欧洲货币
	{ code: 'RUB', symbol: '₽', name: '俄罗斯卢布', nameEn: 'Russian Ruble', flag: '🇷🇺', popular: false },
	{ code: 'PLN', symbol: 'zł', name: '波兰兹罗提', nameEn: 'Polish Zloty', flag: '🇵🇱', popular: false },
	{ code: 'SEK', symbol: 'kr', name: '瑞典克朗', nameEn: 'Swedish Krona', flag: '🇸🇪', popular: false },
	{ code: 'NOK', symbol: 'kr', name: '挪威克朗', nameEn: 'Norwegian Krone', flag: '🇳🇴', popular: false },
	{ code: 'DKK', symbol: 'kr', name: '丹麦克朗', nameEn: 'Danish Krone', flag: '🇩🇰', popular: false },
	{ code: 'CZK', symbol: 'Kč', name: '捷克克朗', nameEn: 'Czech Koruna', flag: '🇨🇿', popular: false },
	{ code: 'HUF', symbol: 'Ft', name: '匈牙利福林', nameEn: 'Hungarian Forint', flag: '🇭🇺', popular: false },
	{ code: 'RON', symbol: 'lei', name: '罗马尼亚列伊', nameEn: 'Romanian Leu', flag: '🇷🇴', popular: false },
	{ code: 'BGN', symbol: 'лв', name: '保加利亚列弗', nameEn: 'Bulgarian Lev', flag: '🇧🇬', popular: false },
	{ code: 'HRK', symbol: 'kn', name: '克罗地亚库纳', nameEn: 'Croatian Kuna', flag: '🇭🇷', popular: false },
	{ code: 'UAH', symbol: '₴', name: '乌克兰格里夫纳', nameEn: 'Ukrainian Hryvnia', flag: '🇺🇦', popular: false },
	{ code: 'ISK', symbol: 'kr', name: '冰岛克朗', nameEn: 'Icelandic Krona', flag: '🇮🇸', popular: false },
	
	// 美洲货币
	{ code: 'MXN', symbol: '$', name: '墨西哥比索', nameEn: 'Mexican Peso', flag: '🇲🇽', popular: false },
	{ code: 'BRL', symbol: 'R$', name: '巴西雷亚尔', nameEn: 'Brazilian Real', flag: '🇧🇷', popular: false },
	{ code: 'ARS', symbol: '$', name: '阿根廷比索', nameEn: 'Argentine Peso', flag: '🇦🇷', popular: false },
	{ code: 'CLP', symbol: '$', name: '智利比索', nameEn: 'Chilean Peso', flag: '🇨🇱', popular: false },
	{ code: 'COP', symbol: '$', name: '哥伦比亚比索', nameEn: 'Colombian Peso', flag: '🇨🇴', popular: false },
	{ code: 'PEN', symbol: 'S/', name: '秘鲁索尔', nameEn: 'Peruvian Sol', flag: '🇵🇪', popular: false },
	{ code: 'UYU', symbol: '$U', name: '乌拉圭比索', nameEn: 'Uruguayan Peso', flag: '🇺🇾', popular: false },
	{ code: 'VES', symbol: 'Bs', name: '委内瑞拉玻利瓦尔', nameEn: 'Venezuelan Bolívar', flag: '🇻🇪', popular: false },
	
	// 非洲货币
	{ code: 'ZAR', symbol: 'R', name: '南非兰特', nameEn: 'South African Rand', flag: '🇿🇦', popular: false },
	{ code: 'EGP', symbol: '£', name: '埃及镑', nameEn: 'Egyptian Pound', flag: '🇪🇬', popular: false },
	{ code: 'NGN', symbol: '₦', name: '尼日利亚奈拉', nameEn: 'Nigerian Naira', flag: '🇳🇬', popular: false },
	{ code: 'KES', symbol: 'KSh', name: '肯尼亚先令', nameEn: 'Kenyan Shilling', flag: '🇰🇪', popular: false },
	{ code: 'GHS', symbol: '₵', name: '加纳塞地', nameEn: 'Ghanaian Cedi', flag: '🇬🇭', popular: false },
	{ code: 'TZS', symbol: 'TSh', name: '坦桑尼亚先令', nameEn: 'Tanzanian Shilling', flag: '🇹🇿', popular: false },
	{ code: 'UGX', symbol: 'USh', name: '乌干达先令', nameEn: 'Ugandan Shilling', flag: '🇺🇬', popular: false },
	{ code: 'MAD', symbol: 'د.م.', name: '摩洛哥迪拉姆', nameEn: 'Moroccan Dirham', flag: '🇲🇦', popular: false },
	{ code: 'TND', symbol: 'د.ت', name: '突尼斯第纳尔', nameEn: 'Tunisian Dinar', flag: '🇹🇳', popular: false },
	{ code: 'ETB', symbol: 'Br', name: '埃塞俄比亚比尔', nameEn: 'Ethiopian Birr', flag: '🇪🇹', popular: false },
	
	// 大洋洲货币
	{ code: 'FJD', symbol: 'FJ$', name: '斐济元', nameEn: 'Fijian Dollar', flag: '🇫🇯', popular: false },
	{ code: 'PGK', symbol: 'K', name: '巴布亚新几内亚基那', nameEn: 'Papua New Guinean Kina', flag: '🇵🇬', popular: false },
	{ code: 'WST', symbol: 'WS$', name: '萨摩亚塔拉', nameEn: 'Samoan Tala', flag: '🇼🇸', popular: false },
	{ code: 'TOP', symbol: 'T$', name: '汤加潘加', nameEn: 'Tongan Paʻanga', flag: '🇹🇴', popular: false },
	
	// 其他主要货币
	{ code: 'AFN', symbol: '؋', name: '阿富汗尼', nameEn: 'Afghan Afghani', flag: '🇦🇫', popular: false },
	{ code: 'ALL', symbol: 'L', name: '阿尔巴尼亚列克', nameEn: 'Albanian Lek', flag: '🇦🇱', popular: false },
	{ code: 'AMD', symbol: '֏', name: '亚美尼亚德拉姆', nameEn: 'Armenian Dram', flag: '🇦🇲', popular: false },
	{ code: 'AOA', symbol: 'Kz', name: '安哥拉宽扎', nameEn: 'Angolan Kwanza', flag: '🇦🇴', popular: false },
	{ code: 'AZN', symbol: '₼', name: '阿塞拜疆马纳特', nameEn: 'Azerbaijani Manat', flag: '🇦🇿', popular: false },
	{ code: 'BAM', symbol: 'KM', name: '波黑马克', nameEn: 'Bosnia-Herzegovina Convertible Mark', flag: '🇧🇦', popular: false },
	{ code: 'BBD', symbol: '$', name: '巴巴多斯元', nameEn: 'Barbadian Dollar', flag: '🇧🇧', popular: false },
	{ code: 'BYN', symbol: 'Br', name: '白俄罗斯卢布', nameEn: 'Belarusian Ruble', flag: '🇧🇾', popular: false },
	{ code: 'BZD', symbol: 'BZ$', name: '伯利兹元', nameEn: 'Belize Dollar', flag: '🇧🇿', popular: false },
	{ code: 'BOB', symbol: 'Bs', name: '玻利维亚诺', nameEn: 'Bolivian Boliviano', flag: '🇧🇴', popular: false },
	{ code: 'BWP', symbol: 'P', name: '博茨瓦纳普拉', nameEn: 'Botswanan Pula', flag: '🇧🇼', popular: false },
	{ code: 'CDF', symbol: 'FC', name: '刚果法郎', nameEn: 'Congolese Franc', flag: '🇨🇩', popular: false },
	{ code: 'CRC', symbol: '₡', name: '哥斯达黎加科朗', nameEn: 'Costa Rican Colón', flag: '🇨🇷', popular: false },
	{ code: 'CUP', symbol: '$', name: '古巴比索', nameEn: 'Cuban Peso', flag: '🇨🇺', popular: false },
	{ code: 'DOP', symbol: 'RD$', name: '多米尼加比索', nameEn: 'Dominican Peso', flag: '🇩🇴', popular: false },
	{ code: 'DZD', symbol: 'د.ج', name: '阿尔及利亚第纳尔', nameEn: 'Algerian Dinar', flag: '🇩🇿', popular: false },
	{ code: 'GEL', symbol: '₾', name: '格鲁吉亚拉里', nameEn: 'Georgian Lari', flag: '🇬🇪', popular: false },
	{ code: 'GTQ', symbol: 'Q', name: '危地马拉格查尔', nameEn: 'Guatemalan Quetzal', flag: '🇬🇹', popular: false },
	{ code: 'HNL', symbol: 'L', name: '洪都拉斯伦皮拉', nameEn: 'Honduran Lempira', flag: '🇭🇳', popular: false },
	{ code: 'JMD', symbol: 'J$', name: '牙买加元', nameEn: 'Jamaican Dollar', flag: '🇯🇲', popular: false },
	{ code: 'KZT', symbol: '₸', name: '哈萨克斯坦坚戈', nameEn: 'Kazakhstani Tenge', flag: '🇰🇿', popular: false },
	{ code: 'LYD', symbol: 'ل.د', name: '利比亚第纳尔', nameEn: 'Libyan Dinar', flag: '🇱🇾', popular: false },
	{ code: 'MDL', symbol: 'L', name: '摩尔多瓦列伊', nameEn: 'Moldovan Leu', flag: '🇲🇩', popular: false },
	{ code: 'MKD', symbol: 'ден', name: '马其顿第纳尔', nameEn: 'Macedonian Denar', flag: '🇲🇰', popular: false },
	{ code: 'MNT', symbol: '₮', name: '蒙古图格里克', nameEn: 'Mongolian Tugrik', flag: '🇲🇳', popular: false },
	{ code: 'MUR', symbol: '₨', name: '毛里求斯卢比', nameEn: 'Mauritian Rupee', flag: '🇲🇺', popular: false },
	{ code: 'MZN', symbol: 'MT', name: '莫桑比克梅蒂卡尔', nameEn: 'Mozambican Metical', flag: '🇲🇿', popular: false },
	{ code: 'NAD', symbol: 'N$', name: '纳米比亚元', nameEn: 'Namibian Dollar', flag: '🇳🇦', popular: false },
	{ code: 'NIO', symbol: 'C$', name: '尼加拉瓜科多巴', nameEn: 'Nicaraguan Córdoba', flag: '🇳🇮', popular: false },
	{ code: 'PAB', symbol: 'B/.', name: '巴拿马巴波亚', nameEn: 'Panamanian Balboa', flag: '🇵🇦', popular: false },
	{ code: 'PYG', symbol: '₲', name: '巴拉圭瓜拉尼', nameEn: 'Paraguayan Guarani', flag: '🇵🇾', popular: false },
	{ code: 'RSD', symbol: 'дин', name: '塞尔维亚第纳尔', nameEn: 'Serbian Dinar', flag: '🇷🇸', popular: false },
	{ code: 'RWF', symbol: 'FRw', name: '卢旺达法郎', nameEn: 'Rwandan Franc', flag: '🇷🇼', popular: false },
	{ code: 'SOS', symbol: 'Sh', name: '索马里先令', nameEn: 'Somali Shilling', flag: '🇸🇴', popular: false },
	{ code: 'SYP', symbol: '£', name: '叙利亚镑', nameEn: 'Syrian Pound', flag: '🇸🇾', popular: false },
	{ code: 'TTD', symbol: 'TT$', name: '特立尼达和多巴哥元', nameEn: 'Trinidad and Tobago Dollar', flag: '🇹🇹', popular: false },
	{ code: 'UZS', symbol: 'so\'m', name: '乌兹别克斯坦索姆', nameEn: 'Uzbekistan Som', flag: '🇺🇿', popular: false },
	{ code: 'XAF', symbol: 'FCFA', name: '中非法郎', nameEn: 'Central African CFA Franc', flag: '🇨🇲', popular: false },
	{ code: 'XCD', symbol: 'EC$', name: '东加勒比元', nameEn: 'East Caribbean Dollar', flag: '🇦🇬', popular: false },
	{ code: 'XOF', symbol: 'CFA', name: '西非法郎', nameEn: 'West African CFA Franc', flag: '🇸🇳', popular: false },
	{ code: 'YER', symbol: '﷼', name: '也门里亚尔', nameEn: 'Yemeni Rial', flag: '🇾🇪', popular: false },
	{ code: 'ZMW', symbol: 'ZK', name: '赞比亚克瓦查', nameEn: 'Zambian Kwacha', flag: '🇿🇲', popular: false },
	{ code: 'ZWL', symbol: 'Z$', name: '津巴布韦元', nameEn: 'Zimbabwean Dollar', flag: '🇿🇼', popular: false }
]

/**
 * 获取常用货币列表
 */
export const getPopularCurrencies = () => {
	return currencyList.filter(c => c.popular)
}

/**
 * 根据代码获取货币信息
 */
export const getCurrencyByCode = (code) => {
	return currencyList.find(c => c.code === code)
}

/**
 * 搜索货币（支持代码、中文名、英文名）
 */
export const searchCurrencies = (keyword) => {
	if (!keyword) return currencyList
	
	const lowerKeyword = keyword.toLowerCase()
	return currencyList.filter(c => 
		c.code.toLowerCase().includes(lowerKeyword) ||
		c.name.includes(keyword) ||
		c.nameEn.toLowerCase().includes(lowerKeyword)
	)
}

export default currencyList

