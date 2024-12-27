export const months = [
	'Січень',
	'Лютий',
	'Березень',
	'Квітень',
	'Травень',
	'Червень',
	'Липень',
	'Серпень',
	'Вересень',
	'Жовтень',
	'Листопад',
	'Грудень'
]

export const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

export const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()

export const getMonthDays = (month, year) => {
	const daysInThisMonth = daysInMonth(month, year)
	const firstDayOfMonth = new Date(year, month, 1).getDay()
	const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

	const days = Array.from({ length: daysInThisMonth }, (_, i) => new Date(year, month, i + 1))

	for (let i = 0; i < offset; i++) {
		days.unshift(null)
	}

	while (days.length % 7 !== 0) {
		days.push(null)
	}

	return days
}
