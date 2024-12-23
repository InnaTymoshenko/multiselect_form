import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { months, weekDays, getDayStyle } from '../../method/calendarLocale'
import { useDateStore } from '../../store/store'

const CalendarPC = ({
	n,
	today,
	defaultRange,
	setDefaultEndDate,
	setCurrentMonth,
	setCurrentYear,
	currentMonth,
	currentYear,
	hoveredDate,
	handleDayMouseEnter,
	handleMouseLeave,
	setShowData
}) => {
	const nextMonth = (currentMonth + 1) % 12
	const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear
	const { startDateFrom, endDate, setEndDate, setStartDateFrom, setDatesSelectedFrom, setDatesSelectedTo } =
		useDateStore()

	const renderMonthPC = ({
		month,
		year,
		startDateFrom,
		endDate,
		hoveredDate,
		handleDayClick,
		handleMouseEnter,
		handleMouseLeave,
		getDayStyle
	}) => {
		const daysInMonth = new Date(year, month + 1, 0).getDate()
		const firstDayOfMonth = new Date(year, month, 1).getDay()

		const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

		const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))

		for (let i = 0; i < offset; i++) {
			days.unshift(null)
		}

		while (days.length % 7 !== 0) {
			days.push(null)
		}

		return (
			<div style={{ color: '#666', padding: '1.25rem', margin: '5px', backgroundColor: 'white' }}>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '.5rem',
						marginBottom: '1rem'
					}}
				>
					<h4 style={{ color: '#666', textTransform: 'uppercase' }}>
						{months[month]} {year}
					</h4>
					<div
						style={{
							width: '100%',
							display: 'grid',
							gridTemplateColumns: 'repeat(7, 1fr)',
							gap: '5px',
							textAlign: 'center'
						}}
					>
						{weekDays.map(day => (
							<div key={day} style={{ fontSize: '.8em', fontWeight: 'bold', textTransform: 'lowercase' }}>
								{day}
							</div>
						))}
					</div>
				</div>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(7, 1fr)',
						gap: '5px',
						textAlign: 'center'
					}}
				>
					{days.map((day, index) => (
						<div
							key={index}
							style={getDayStyle(day, today, startDateFrom, endDate, hoveredDate, defaultRange, n)}
							onClick={() => day && handleDayClick(day)}
							onMouseEnter={() => day && handleMouseEnter(day)}
							onMouseLeave={() => day && handleMouseLeave(day)}
						>
							{day ? day.getDate() : ''}
						</div>
					))}
				</div>
			</div>
		)
	}

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
			(startDateFrom && day < startDateFrom) ||
			(startDateFrom && endDate && day > endDate) ||
			(!startDateFrom && day < today)

		if (isDisabled) return

		if (!startDateFrom) {
			setStartDateFrom(day)
			const calculatedEndDate = new Date(day)
			calculatedEndDate.setDate(day.getDate() + n)
			setDefaultEndDate(calculatedEndDate)
			setDatesSelectedFrom(true)
			setEndDate(null)
			swappedMonth(day)
		} else if (!endDate) {
			setEndDate(day)
			setDatesSelectedTo(true)
			setShowData(false)
		} else {
			setStartDateFrom(day)
			setEndDate(null)
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

	return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
			<div style={{ display: 'flex', position: 'relative', marginBottom: '20px' }}>
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
					year: currentYear,
					startDateFrom,
					endDate,
					hoveredDate,
					handleDayClick,
					handleMouseEnter: handleDayMouseEnter,
					handleMouseLeave: handleMouseLeave,
					getDayStyle
				})}
				{renderMonthPC({
					month: nextMonth,
					year: nextMonthYear,
					startDateFrom,
					endDate,
					hoveredDate,
					handleDayClick,
					handleMouseEnter: handleDayMouseEnter,
					handleMouseLeave: handleMouseLeave,
					getDayStyle
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
	)
}

export default CalendarPC
