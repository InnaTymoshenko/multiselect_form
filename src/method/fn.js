export async function getData(url) {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}

export const formatToDate = dateString => {
	if (!dateString || typeof dateString !== 'string') {
		return ''
	}

	const months = ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд']

	const [day, month] = dateString.split('-')

	if (!day || !month || isNaN(parseInt(day)) || isNaN(parseInt(month))) {
		return ''
	}

	return `${parseInt(day)} ${months[parseInt(month) - 1] || ''}`
}

export const formatToStoreDate = input => {
	if (!input) return ''

	if (typeof input === 'string' && /^\d{2}\.\d{2}\.\d{4}$/.test(input)) {
		const [day, month, year] = input.split('.')
		return `${day}-${month}-${year}`
	}

	const date = input instanceof Date ? input : new Date(input)
	if (isNaN(date.getTime())) {
		console.error('Некорректная дата:', input)
		return ''
	}

	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const year = date.getFullYear()

	return `${day}-${month}-${year}`
}

export const formattedDate = dateString => {
	const months = ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд']

	const date = new Date(dateString)
	const day = date.getDate()
	const month = months[date.getMonth()]

	return `${day} ${month}`
}

export const parseDate = dateString => {
	if (!dateString) return null
	const [day, month, year] = dateString.split('-')
	return new Date(`${year}-${month}-${day}`)
}

export const getNightsText = nights => {
	const min = parseInt(nights.split('-')[0], 10)
	return min < 4 || (min >= 19 && min <= 22) ? 'ночі' : 'ночей'
}

export const getDaysText = days => {
	const min = parseInt(days.split('-')[0], 10)
	return min < 4 || (min >= 20 && min <= 23) ? 'дні' : 'днів'
}
