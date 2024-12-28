import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { months, weekDays, getMonthDays } from '../../../method/calendarLocale'
import { useDateStore } from '../../../store/store'

const CalendarPC = ({
	n,
	setShowData,
	currentMonth,
	currentYear,
	today,
	handleMouseLeave,
	handleMouseEnter,
	setCurrentMonth,
	setCurrentYear,
	calculateDateTo
}) => {
	const {
		defaultStartDate,
		startDate,
		setStartDate,
		hoverTempDate,
		resetHoverTempDate,
		addedToLocalStorage,
		setHoverTempDate,
		resetDefaultStartDate
	} = useDateStore()

	const nextMonth = (currentMonth + 1) % 12
	const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear

	const swappedMonth = day => {
		const secondMonthEnd = new Date(nextMonthYear, nextMonth + 1, 0)
		const potentialEndDate = new Date(day)
		potentialEndDate.setDate(potentialEndDate.getDate() + n)

		if (potentialEndDate > secondMonthEnd) {
			setCurrentMonth((currentMonth + 1) % 12)
			if (currentMonth === 11) {
				setCurrentYear(prevYear => prevYear + 1)
			}
		}
	}

	const handleDayClick = day => {
		if (!day) return

		const isDisabled =
			(!startDate.dateFrom && day < today) ||
			(startDate.dateFrom && !startDate.dateTo && day > new Date(calculateDateTo(startDate.dateFrom, n))) ||
			(startDate.dateFrom &&
				startDate.dateTo &&
				(day < new Date(startDate.dateFrom) || day > new Date(startDate.dateTo)))

		if (isDisabled && day.toDateString() !== today.toDateString()) return

		if (!startDate.dateFrom) {
			setStartDate(day.toISOString(), '')
			setHoverTempDate(day.toISOString(), calculateDateTo(day, n))
			resetDefaultStartDate()
			swappedMonth(day)
		} else if (!startDate.dateTo) {
			setStartDate(startDate.dateFrom, day.toISOString())
			resetHoverTempDate()
			addedToLocalStorage()
			setShowData(false)
		}
	}

	const handlePrevious = e => {
		e.preventDefault()
		if (currentMonth === 0) {
			setCurrentMonth(10)
			setCurrentYear(prevYear => prevYear - 1)
		} else if (currentMonth === 1) {
			setCurrentMonth(11)
			setCurrentYear(prevYear => prevYear - 1)
		} else {
			setCurrentMonth(prevMonth => (prevMonth - 2 + 12) % 12)
		}
	}

	const handleNext = e => {
		e.preventDefault()
		if (currentMonth === 10) {
			setCurrentMonth(0)
			setCurrentYear(prevYear => prevYear + 1)
		} else if (currentMonth === 11) {
			setCurrentMonth(1)
			setCurrentYear(prevYear => prevYear + 1)
		} else {
			setCurrentMonth(prevMonth => (prevMonth + 2) % 12)
		}
	}

	const getDayStyle = day => {
		if (!day) return {}

		const isToday = day.toDateString() === today.toDateString()

		const isDefaultRange =
			defaultStartDate.dateFrom &&
			defaultStartDate.dateTo &&
			day >= new Date(defaultStartDate.dateFrom) &&
			day <= new Date(defaultStartDate.dateTo)

		const isHoverTempRange =
			hoverTempDate.dateFrom &&
			hoverTempDate.dateTo &&
			day >= new Date(hoverTempDate.dateFrom) &&
			day <= new Date(hoverTempDate.dateTo)

		const isInFinalRange =
			startDate.dateFrom &&
			!startDate.dateTo &&
			hoverTempDate.dateTo &&
			day >= new Date(startDate.dateFrom) &&
			day <= new Date(hoverTempDate.dateTo)

		const isFixedRange =
			startDate.dateFrom && startDate.dateTo && day >= new Date(startDate.dateFrom) && day <= new Date(startDate.dateTo)

		const isStaticRange =
			startDate.dateFrom &&
			!startDate.dateTo &&
			day >= new Date(startDate.dateFrom) &&
			day <= new Date(calculateDateTo(startDate.dateFrom, n))

		const isSelected =
			(startDate.dateFrom && day.toDateString() === new Date(startDate.dateFrom).toDateString()) ||
			(startDate.dateTo && day.toDateString() === new Date(startDate.dateTo).toDateString()) ||
			(defaultStartDate.dateFrom && day.toDateString() === new Date(defaultStartDate.dateFrom).toDateString()) ||
			(hoverTempDate.dateFrom && day.toDateString() === new Date(hoverTempDate.dateFrom).toDateString())

		const isSelectedEnd =
			(hoverTempDate.dateTo && day.toDateString() === new Date(hoverTempDate.dateTo).toDateString()) ||
			(startDate.dateTo && day.toDateString() === new Date(startDate.dateTo).toDateString()) ||
			(defaultStartDate.dateTo && day.toDateString() === new Date(defaultStartDate.dateTo).toDateString())

		const isDisabled =
			(!startDate.dateFrom && day < today) ||
			(startDate.dateFrom &&
				!startDate.dateTo &&
				(day < new Date(startDate.dateFrom) || day > new Date(calculateDateTo(startDate.dateFrom, n)))) ||
			(startDate.dateFrom &&
				startDate.dateTo &&
				(day < new Date(startDate.dateFrom) || day > new Date(startDate.dateTo)))

		const isTodayAccessible = isToday && (!startDate.dateFrom || day >= new Date(startDate.dateFrom))

		const baseStyle = {
			position: 'relative',
			width: '1.7rem',
			height: '1.5rem',
			padding: '3px',
			borderRadius: '3px',
			backgroundColor: isToday
				? '#fef2e0'
				: isFixedRange || isInFinalRange || isHoverTempRange || isDefaultRange || isStaticRange
				? '#DDE6A7'
				: isDisabled
				? '#f5f5f5'
				: '#f5f5f5',
			cursor: isDisabled ? 'default' : 'pointer',
			color: isToday
				? '#3f51b5'
				: isSelected || isFixedRange || isInFinalRange || isHoverTempRange || isDefaultRange
				? '#fff'
				: isDisabled
				? '#aaa'
				: '#3f51b5',
			border: '1px solid #ccc',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			transition: 'background-color 0.8s, transform 0.2s'
		}

		if ((isSelected && isToday) || isSelected) {
			baseStyle.backgroundColor = '#B4CB5B'
			baseStyle.color = 'white'
			baseStyle.clipPath = 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)'
		}

		if (isSelectedEnd) {
			baseStyle.backgroundColor = '#B4CB5B'
			baseStyle.color = 'white'
			baseStyle.clipPath = 'polygon(100% 0%, 100% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)'
		}

		if (isDisabled && !isTodayAccessible) {
			baseStyle.pointerEvents = 'none'
		}

		return baseStyle
	}

	const renderMonthPC = ({ month, year }) => {
		const days = getMonthDays(month, year)
		return (
			<div style={styles.monthContainer}>
				<div style={styles.header}>
					<h4 style={styles.title}>
						{months[month]} {year}
					</h4>
					<div style={styles.grid}>
						{weekDays.map(day => (
							<div key={day} style={styles.weekDay}>
								{day}
							</div>
						))}
					</div>
				</div>

				<div style={styles.grid}>
					{days.map((day, index) => (
						<div
							key={index}
							style={getDayStyle(day, today)}
							onMouseEnter={() => handleMouseEnter(day)}
							onMouseLeave={handleMouseLeave}
							onClick={() => handleDayClick(day)}
						>
							{day ? day.getDate() : ''}
						</div>
					))}
				</div>
			</div>
		)
	}

	const styles = {
		monthContainer: {
			color: '#666',
			padding: '.5rem',
			margin: '5px',
			backgroundColor: 'white'
		},
		header: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: '.5rem',
			marginBottom: '1rem'
		},
		title: {
			color: '#666',
			textTransform: 'uppercase'
		},
		grid: {
			width: '100%',
			display: 'grid',
			gridTemplateColumns: 'repeat(7, 1fr)',
			gap: '3px',
			textAlign: 'center',
			fontSize: '.8em'
		},
		weekDay: {
			fontSize: '1em',
			fontWeight: 'bold',
			textTransform: 'lowercase'
		}
	}

	return (
		<>
			<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
				<div style={{ display: 'flex', position: 'relative', height: '15rem' }}>
					<MdKeyboardArrowLeft
						onClick={currentMonth > today.getMonth() || currentYear > today.getFullYear() ? handlePrevious : undefined}
						style={{
							fontSize: '1.75rem',
							color: currentMonth > today.getMonth() || currentYear > today.getFullYear() ? '#666' : '#ccc',
							position: 'absolute',
							top: '6%',
							left: '3%',
							cursor: currentMonth > today.getMonth() || currentYear > today.getFullYear() ? 'pointer' : 'default'
						}}
					/>
					{renderMonthPC({
						month: currentMonth,
						year: currentYear
					})}
					{renderMonthPC({
						month: nextMonth,
						year: nextMonthYear
					})}
					<MdKeyboardArrowRight
						onClick={handleNext}
						style={{
							fontSize: '1.75rem',
							color: '#666',
							position: 'absolute',
							top: '6%',
							right: '3%',
							сursor: 'pointer'
						}}
					/>
				</div>
			</div>
		</>
	)
}

export default CalendarPC
