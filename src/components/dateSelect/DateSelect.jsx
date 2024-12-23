/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { FaRegCalendarDays } from 'react-icons/fa6'
import { TfiLayoutLineSolid } from 'react-icons/tfi'
import { useMediaQuery } from '../../method/useMediaQuery'
import { useDateStore, useResortsStore } from '../../store/store'
import CalendarPC from './CalendarPC'
import CalendarMobile from './CalendarMobile'
import { weekDays } from '../../method/calendarLocale'
import { formatToDate } from '../../method/fn'

import styles from './dataSelect.module.css'

const DataSelect = ({ n = 10 }) => {
	const today = useMemo(() => new Date(), [])
	const [currentMonth, setCurrentMonth] = useState(today.getMonth())
	const [currentYear, setCurrentYear] = useState(today.getFullYear())
	const [hoveredDate, setHoveredDate] = useState(null)
	const [temporaryDates, setTemporaryDates] = useState([])
	const [defaultRange, setDefaultRange] = useState(null)
	const [defaultEndDate, setDefaultEndDate] = useState(
		new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)
	)
	const [error, setError] = useState(false)
	const [showData, setShowData] = useState(false)
	const dataRef = useRef(null)
	const { selectedCountry } = useResortsStore()
	const {
		startDate,
		datesSelectedFrom,
		datesSelectedTo,
		startDateFrom,
		endDate,
		setEndDate,
		setStartDateFrom,
		setDatesSelectedFrom,
		setDatesSelectedTo
	} = useDateStore()
	const isMobileShow = useMediaQuery('(max-width: 768px)')

	const openCalendarHandler = () => {
		if (selectedCountry) {
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

	console.log(startDate)

	useEffect(() => {
		if (!startDateFrom && !endDate) {
			const defaultStart = new Date(today)
			const defaultEnd = new Date(today)
			defaultEnd.setDate(defaultEnd.getDate() + n)
			setDefaultRange({ start: defaultStart, end: defaultEnd })
			setStartDateFrom(null)
			setEndDate(null)
			setDatesSelectedFrom(false)
			setDatesSelectedTo(false)
		}
	}, [endDate, n, setDatesSelectedFrom, setDatesSelectedTo, setEndDate, setStartDateFrom, startDateFrom, today])

	useEffect(() => {
		if (startDateFrom && !endDate) {
			const calculatedEndDate = new Date(startDateFrom)
			calculatedEndDate.setDate(startDateFrom.getDate() + n)
			setDefaultEndDate(calculatedEndDate)
		}
	}, [startDateFrom, n, endDate])

	useEffect(() => {
		if (startDateFrom && hoveredDate && !endDate) {
			const tempDates = []
			const start = new Date(startDateFrom)
			const end = new Date(hoveredDate)
			for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
				tempDates.push(new Date(d))
			}
			setTemporaryDates(tempDates)
		} else {
			setTemporaryDates([])
		}
	}, [startDateFrom, hoveredDate, endDate])

	const handleDayMouseEnter = day => {
		if (!startDateFrom || endDate) return
		setHoveredDate(day)
	}

	const handleMouseLeave = () => setHoveredDate(null)

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
								value={startDate.dateFrom && datesSelectedFrom ? `${formatToDate(startDate.dateFrom)}` : ''}
								readOnly
								onClick={openCalendarHandler}
							/>
							<TfiLayoutLineSolid />
							<input
								className={styles.searchDate}
								type="text"
								placeholder={`по`}
								value={startDate.dateTo && datesSelectedTo ? `${formatToDate(startDate.dateTo)}` : ''}
								readOnly
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
								defaultRange={defaultRange}
								setStartDateFrom={setStartDateFrom}
								setDefaultEndDate={setDefaultEndDate}
								setCurrentMonth={setCurrentMonth}
								setCurrentYear={setCurrentYear}
								currentMonth={currentMonth}
								currentYear={currentYear}
								hoveredDate={hoveredDate}
								handleDayMouseEnter={handleDayMouseEnter}
								handleMouseLeave={handleMouseLeave}
								setShowData={setShowData}
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
									defaultRange={defaultRange}
									setStartDateFrom={setStartDateFrom}
									setDefaultEndDate={setDefaultEndDate}
									currentMonth={currentMonth}
									currentYear={currentYear}
									hoveredDate={hoveredDate}
									handleDayMouseEnter={handleDayMouseEnter}
									handleMouseLeave={handleMouseLeave}
									setShowData={setShowData}
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
