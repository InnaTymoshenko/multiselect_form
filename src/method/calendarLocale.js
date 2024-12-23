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

export const getDayStyle = (day, today, startDateFrom, endDate, hoveredDate, defaultRange, n) => {
	if (!day) return {}
	const isToday = day.toDateString() === today.toDateString()
	const isStart = startDateFrom && day.toDateString() === startDateFrom.toDateString()
	const isEnd = endDate && day.toDateString() === endDate.toDateString()
	const isHovered = hoveredDate && day.toDateString() === hoveredDate.toDateString()
	const temporaryEndDate = startDateFrom ? new Date(startDateFrom.getTime() + n * 24 * 60 * 60 * 1000) : null
	const isTemporaryEnd = startDateFrom && !endDate && day.toDateString() === temporaryEndDate.toDateString()
	const isInRange =
		startDateFrom &&
		(!endDate ? day > startDateFrom && day <= (hoveredDate || temporaryEndDate) : day > startDateFrom && day <= endDate)
	const isDefaultInRange =
		defaultRange && day >= defaultRange.start && day <= defaultRange.end && !startDateFrom && !endDate
	const isDefaultStart = isDefaultInRange && day.toDateString() === today.toDateString()
	const isDefaultEnd =
		isDefaultInRange && day.toDateString() === new Date(today.getTime() + n * 24 * 60 * 60 * 1000).toDateString()
	const isDisabled =
		(startDateFrom && day < startDateFrom) ||
		(startDateFrom && endDate && day > endDate) ||
		(!startDateFrom && day < today)

	const baseStyle = {
		width: '2rem',
		height: '2rem',
		padding: '5px',
		borderRadius: '3px',
		backgroundColor: isToday ? '#fef2e0' : isDisabled ? '#E0E0E0' : '#f5f5f5',
		cursor: isDisabled ? 'default' : 'pointer',
		color: isToday ? '#3f51b5' : isDisabled ? '#aaa' : '#3f51b5',
		border: '1px solid #ccc',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	}

	if (isHovered && !isDisabled) {
		baseStyle.backgroundColor = '#b4cb5b'
		baseStyle.color = 'white'
		baseStyle.clipPath = 'polygon(100% 0%, 100% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)'
	}

	if (isStart || isDefaultStart) {
		baseStyle.backgroundColor = '#b4cb5b'
		baseStyle.color = 'white'
		baseStyle.clipPath = 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)'
	}

	if (isEnd || isDefaultEnd || isTemporaryEnd) {
		baseStyle.backgroundColor = '#b4cb5b'
		baseStyle.color = 'white'
		baseStyle.clipPath = 'polygon(100% 0%, 100% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)'
	}

	if (isDefaultInRange && !startDateFrom && !endDate) {
		baseStyle.backgroundColor = '#DDE6A7'
	}

	if (isInRange && !isStart && !isEnd) {
		baseStyle.backgroundColor = '#DDE6A7'
	}

	return baseStyle
}
