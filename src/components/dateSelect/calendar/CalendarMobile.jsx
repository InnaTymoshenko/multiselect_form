/* eslint-disable no-unused-vars */
import React from 'react'
import { months, getMonthDays } from '../../../method/calendarLocale'
import { useDateStore } from '../../../store/store'

const CalendarMobile = ({
	n,
	setShowData,
	currentMonth,
	currentYear,
	today,
	handleMouseLeave,
	handleMouseEnter,
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

	const getNextMonthYear = (startMonth, offset) => {
		const newMonth = (startMonth + offset) % 12
		const newYear = currentYear + Math.floor((startMonth + offset) / 12)
		return { month: newMonth, year: newYear }
	}

	const handleDayClick = day => {
		if (!day) return

		const isDisabled =
			(!startDate.dateFrom && day < today) ||
			(startDate.dateFrom && day < new Date(startDate.dateFrom)) ||
			(startDate.dateFrom && startDate.dateTo && day > new Date(startDate.dateTo)) ||
			(startDate.dateFrom && day < startDate.dateFrom) ||
			(startDate.dateFrom && startDate.dateTo && day > startDate.dateTo)

		if (isDisabled) return

		if (!startDate.dateFrom) {
			setStartDate(day.toISOString(), '')
			setHoverTempDate(day.toISOString(), calculateDateTo(day, n))
			resetDefaultStartDate()
		} else if (!startDate.dateTo) {
			setStartDate(startDate.dateFrom, day.toISOString())
			resetHoverTempDate()
			addedToLocalStorage()
			setShowData(false)
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

		const isStaticRange =
			startDate.dateFrom &&
			!startDate.dateTo &&
			day >= new Date(startDate.dateFrom) &&
			day <= new Date(calculateDateTo(startDate.dateFrom, n))

		const isFixedRange =
			startDate.dateFrom && startDate.dateTo && day >= new Date(startDate.dateFrom) && day <= new Date(startDate.dateTo)

		const isSelected =
			(defaultStartDate.dateFrom && day.toDateString() === new Date(defaultStartDate.dateFrom).toDateString()) ||
			(hoverTempDate.dateFrom && day.toDateString() === new Date(hoverTempDate.dateFrom).toDateString()) ||
			(startDate.dateFrom && day.toDateString() === new Date(startDate.dateFrom).toDateString())

		const isSelectedEnd =
			(startDate.dateTo && day.toDateString() === new Date(startDate.dateTo).toDateString()) ||
			(hoverTempDate.dateTo && day.toDateString() === new Date(hoverTempDate.dateTo).toDateString()) ||
			(defaultStartDate.dateTo && day.toDateString() === new Date(defaultStartDate.dateTo).toDateString())

		const isDisabled =
			(!startDate.dateFrom && day < today) ||
			(startDate.dateFrom &&
				!startDate.dateTo &&
				(day < new Date(startDate.dateFrom) || day > new Date(calculateDateTo(startDate.dateFrom, n)))) ||
			(startDate.dateFrom &&
				startDate.dateTo &&
				(day < new Date(startDate.dateFrom) || day > new Date(startDate.dateTo)))

		const baseStyle = {
			position: 'relative',
			width: '2.5rem',
			height: '2rem',
			padding: '5px',
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
				: isSelected || isFixedRange || isInFinalRange || isHoverTempRange || isDefaultRange || isStaticRange
				? '#fff'
				: isDisabled
				? '#aaa'
				: '#3f51b5',
			border: '1px solid #ccc',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			transition: 'background-color 0.5s, transform 0.2s'
		}

		if (isSelected) {
			baseStyle.backgroundColor = '#B4CB5B'
			baseStyle.color = 'white'
			baseStyle.clipPath = 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)'
		}

		if (isSelectedEnd) {
			baseStyle.backgroundColor = '#B4CB5B'
			baseStyle.color = 'white'
			baseStyle.clipPath = 'polygon(100% 0%, 100% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)'
		}

		if (isDisabled) {
			baseStyle.pointerEvents = 'none'
		}

		return baseStyle
	}

	const renderMonth = (month, year) => {
		const days = getMonthDays(month, year)

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
					<h4 style={{ textAlign: 'center', textTransform: 'uppercase' }}>
						{months[month]} {year}
					</h4>
				</div>

				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', fontSize: '1.2em' }}>
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

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: '1rem',
				padding: '1rem',
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
