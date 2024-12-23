/* eslint-disable no-unused-vars */
import React from 'react'
import { months } from '../../method/calendarLocale'
import { useDateStore } from '../../store/store'

const CalendarMobile = ({
	n,
	today,
	defaultRange,
	setDefaultEndDate,
	currentMonth,
	currentYear,
	hoveredDate,
	handleDayMouseEnter,
	handleMouseLeave,
	setShowData
}) => {
	const { startDateFrom, endDate, setEndDate, setStartDateFrom, setDatesSelectedFrom, setDatesSelectedTo } =
		useDateStore()

	const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
	const getNextMonthYear = (startMonth, offset) => {
		const newMonth = (startMonth + offset) % 12
		const newYear = currentYear + Math.floor((startMonth + offset) / 12)
		return { month: newMonth, year: newYear }
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
		} else if (!endDate) {
			setEndDate(day)
			setDatesSelectedTo(true)
			setShowData(false)
		} else {
			setStartDateFrom(day)
			setEndDate(null)
		}
	}
	const getDayStyle = day => {
		if (!day) return {}
		const isToday = day.toDateString() === today.toDateString()
		const isStart = startDateFrom && day.toDateString() === startDateFrom.toDateString()
		const isEnd = endDate && day.toDateString() === endDate.toDateString()
		const isHovered = hoveredDate && day.toDateString() === hoveredDate.toDateString()
		const temporaryEndDate = startDateFrom ? new Date(startDateFrom.getTime() + n * 24 * 60 * 60 * 1000) : null
		const isTemporaryEnd = startDateFrom && !endDate && day.toDateString() === temporaryEndDate.toDateString()
		const isInRange =
			startDateFrom &&
			(!endDate
				? day > startDateFrom && day <= (hoveredDate || temporaryEndDate)
				: day > startDateFrom && day <= endDate)
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

	const renderMonth = (month, year) => {
		const daysInMonthCount = daysInMonth(month, year)
		const firstDayOfWeek = new Date(year, month, 1).getDay()
		const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

		const days = Array.from({ length: daysInMonthCount }, (_, i) => new Date(year, month, i + 1))
		for (let i = 0; i < offset; i++) days.unshift(null)

		while (days.length % 7 !== 0) days.push(null)

		return (
			<div key={`${month}-${year}`} style={{ marginBottom: '1rem' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginBottom: '1rem',
						fontWeight: 'bold',
						textTransform: 'uppercase'
					}}
				>
					<h4 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
						{months[month]} {year}
					</h4>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
					{days.map((day, index) => (
						<div
							key={index}
							style={getDayStyle(day)}
							onClick={() => day && handleDayClick(day)}
							onMouseEnter={() => day && handleDayMouseEnter(day)}
							onMouseLeave={() => day && handleMouseLeave(day)}
						>
							{day ? day.getDate() : ''}
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: '1rem',
				padding: '.5rem',
				marginBlockStart: '7rem'
			}}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
				{Array.from({ length: 12 }).map((_, index) => {
					const { month, year } = getNextMonthYear(currentMonth, index)
					return renderMonth(month, year)
				})}
			</div>
		</div>
	)
}

export default CalendarMobile
