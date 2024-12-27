import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { TfiLayoutLineSolid } from 'react-icons/tfi'
import { useMediaQuery } from '../../method/useMediaQuery'
import CalendarPC from './calendar/CalendarPC'
import CalendarMobile from './calendar/CalendarMobile'
import { useResortsStore, useDateStore } from '../../store/store'
import { weekDays } from '../../method/calendarLocale'
import { formattedDate, formatToDate, parseDate } from '../../method/fn'

import styles from './dataSelect.module.css'

const DataSelect = ({ n = 10 }) => {
	const today = useMemo(() => new Date(), [])
	const [currentMonth, setCurrentMonth] = useState(today.getMonth())
	const [currentYear, setCurrentYear] = useState(today.getFullYear())
	const [error, setError] = useState(false)
	const [showData, setShowData] = useState(false)
	const dataRef = useRef(null)
	const { selectedCountry } = useResortsStore()
	const {
		setDefaultStartDate,
		resetDefaultStartDate,
		resetStartDate,
		startDate,
		setHoverTempDate,
		resetHoverTempDate
	} = useDateStore()

	const isMobileShow = useMediaQuery('(max-width: 768px)')

	useEffect(() => {
		const savedDates = localStorage.getItem('selectedDate')
		if (!savedDates) {
			localStorage.setItem('selectedDate', JSON.stringify({ dateFrom: '', dateTo: '' }))
		}
	}, [])

	const calculateDateTo = (dateFrom, days) => {
		const newDate = new Date(dateFrom)
		newDate.setDate(newDate.getDate() + days)
		return newDate.toISOString()
	}

	const openCalendarHandler = () => {
		if (selectedCountry !== '' && selectedCountry !== null) {
			const savedDates = JSON.parse(localStorage.getItem('selectedDate'))

			if (savedDates.dateFrom !== '') {
				setDefaultStartDate(parseDate(savedDates.dateFrom).toISOString(), parseDate(savedDates.dateTo).toISOString())
				resetStartDate()
			} else {
				const defaultDateFrom = today.toISOString()
				const defaultDateTo = calculateDateTo(today, n)
				setDefaultStartDate(defaultDateFrom, defaultDateTo)
			}
			setShowData(!showData)
		} else {
			setError(!error)
		}
	}

	const handleOutsideClickDate = useCallback(event => {
		if (dataRef.current && !dataRef.current.contains(event.target)) {
			setError(false)
			setShowData(false)
		}
	}, [])

	useEffect(() => {
		const handleClick = event => handleOutsideClickDate(event)

		if (error || showData) {
			document.addEventListener('click', handleClick)
		}

		return () => {
			document.removeEventListener('click', handleClick)
		}
	}, [error, handleOutsideClickDate, showData])

	const closeCalendar = () => {
		setShowData(false)
	}

	const handleMouseEnter = day => {
		if (!day || day < today) return

		if (!startDate.dateFrom) {
			resetDefaultStartDate()
			setHoverTempDate(day.toISOString(), calculateDateTo(day, n))
		} else if (startDate.dateFrom && !startDate.dateTo) {
			setHoverTempDate('', day.toISOString())
		}
	}

	const handleMouseLeave = () => {
		resetHoverTempDate()
	}

	return (
		<>
			<div className={styles.wrapperDiv} ref={dataRef}>
				<div className={styles.groupInfo}>
					<div className={styles.formField}>
						<FaRegCalendarDays className={styles.dateIcon} onClick={openCalendarHandler} />
						<div className={styles.blockDateInput}>
							<input
								className={styles.searchDate}
								type="text"
								placeholder={`з`}
								value={
									startDate.dateFrom
										? formattedDate(startDate.dateFrom)
										: localStorage.getItem('selectedDate')
										? formatToDate(JSON.parse(localStorage.getItem('selectedDate')).dateFrom)
										: ''
								}
								readOnly
								onClick={openCalendarHandler}
							/>
							<TfiLayoutLineSolid />
							<input
								className={styles.searchDate}
								type="text"
								placeholder={`по`}
								value={
									startDate.dateTo
										? formattedDate(startDate.dateTo)
										: localStorage.getItem('selectedDate')
										? formatToDate(JSON.parse(localStorage.getItem('selectedDate')).dateTo)
										: ''
								}
								readOnly
								onClick={!isMobileShow ? () => openCalendarHandler() : () => {}}
							/>
						</div>
					</div>
					{error && <div className={styles.blockError}>Спочатку заповніть поле "Країна, курорт, готель"</div>}
				</div>
				{showData && !isMobileShow && (
					<div className={styles.formList}>
						<h3 className={styles.title}>Початок туру</h3>
						<div className={styles.searchList}>
							<CalendarPC
								n={n}
								today={today}
								setShowData={setShowData}
								currentMonth={currentMonth}
								currentYear={currentYear}
								setCurrentMonth={setCurrentMonth}
								setCurrentYear={setCurrentYear}
								handleMouseLeave={handleMouseLeave}
								handleMouseEnter={handleMouseEnter}
								calculateDateTo={calculateDateTo}
							/>
						</div>
					</div>
				)}
				{showData && isMobileShow && (
					<div className={styles.wrapperDivModal}>
						<div className={styles.headerModalDate}>
							<div className={styles.modalHeader}>
								<span style={{ fontWeight: 'bold' }}>Початок туру</span>
								<span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={closeCalendar}>
									X
								</span>
							</div>
							<div className={styles.weekDaysModal}>
								{weekDays.map(day => (
									<div key={day} style={{ fontSize: '1em', fontWeight: 'bold', textTransform: 'lowercase' }}>
										{day}
									</div>
								))}
							</div>
						</div>
						<div className={styles.formListMobile}>
							<div className={styles.searchListModal}>
								<CalendarMobile
									n={n}
									today={today}
									setShowData={setShowData}
									currentMonth={currentMonth}
									currentYear={currentYear}
									setCurrentMonth={setCurrentMonth}
									setCurrentYear={setCurrentYear}
									handleMouseLeave={handleMouseLeave}
									handleMouseEnter={handleMouseEnter}
									calculateDateTo={calculateDateTo}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	)
}

export default DataSelect
