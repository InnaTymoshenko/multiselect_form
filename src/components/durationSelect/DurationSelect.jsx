import React, { useEffect, useRef, useState } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useMediaQuery } from '../../method/useMediaQuery'
import { tourDuration } from '../../data/duration'
import { useResortsStore } from '../../store/store'
import { getDaysText, getNightsText } from '../../method/fn'

import styles from './durationSelect.module.css'

const DurationSelect = () => {
	const [openDurationForm, setOpenDurationForm] = useState(false)
	const [isDurationMobile, setIsDurationMobile] = useState(false)
	const [selectDuration, setSelectDuration] = useState(null)
	const [chooseTourDuration, setChooseTourDuration] = useState(null)
	const [durationValue, setDurationValue] = useState('')
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()
	const { selectedCountry } = useResortsStore()
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const durationRef = useRef(null)
	const durationInputRef = useRef(null)

	useEffect(() => {
		if (selectedCountry) {
			setSelectDuration(5)
		}
	}, [selectedCountry])

	useEffect(() => {
		if (openDurationForm && durationInputRef.current) {
			durationInputRef.current.focus()
		}
	}, [openDurationForm])

	const handleDurationInputClick = () => {
		if (isMobileShow) {
			setIsDurationMobile(true)
			setOpenDurationForm(true)
		} else {
			setIsDurationMobile(false)
			setOpenDurationForm(!openDurationForm)
		}
	}

	const handleOutsideClickDuration = event => {
		if (durationRef.current && !durationRef.current.contains(event.target)) {
			setOpenDurationForm(false)
		}
	}

	useEffect(() => {
		if (openDurationForm) {
			document.addEventListener('click', handleOutsideClickDuration)
		} else {
			document.removeEventListener('click', handleOutsideClickDuration)
		}

		return () => {
			document.removeEventListener('click', handleOutsideClickDuration)
		}
	}, [openDurationForm])

	const chooseDuration = (value, index) => {
		const findDuration = tourDuration.find((d, i) => i === index)
		setDurationValue(`на ${findDuration.nights} ${getNightsText(findDuration.nights)}`)
		const tempDuration = {
			[index + 1]: findDuration.nights
		}
		setSelectDuration(index)
		setChooseTourDuration(tempDuration)
		setOpenDurationForm(false)
		setIsDurationMobile(false)
		localStorage.setItem('selectedDuration', JSON.stringify(tempDuration))
	}

	return (
		<>
			<div className={styles.wrapperDiv} ref={durationRef}>
				<div className={styles.formField} tabIndex="-1">
					<input
						className={styles.searchAir}
						type="search"
						placeholder={'на 6-8 ночей'}
						value={durationValue}
						onClick={handleDurationInputClick}
						readOnly
					/>
					<BiSolidDownArrow className={styles.formIcon} />
				</div>
				{openDurationForm && !isMobileShow && (
					<div className={styles.formList}>
						<div className={styles.searchList}>
							<div className={styles.listCountry}>
								<ul style={{ listStyle: 'none', paddingLeft: '6px' }}>
									{tourDuration.map((d, index) => {
										const isDisabled =
											!localStorage.getItem('selectedResort') ||
											!JSON.parse(localStorage.getItem('selectedResort')).country

										return (
											<li
												key={`nights-${d.nights}-days-${d.days}`}
												style={{
													backgroundColor:
														selectDuration === index
															? '#E2E8EF'
															: hoveredItem === index
															? '#F5F5F5'
															: selectDuration === null && index === 5
															? '#E2E8EF'
															: '',
													padding: '6px',
													cursor: isDisabled ? 'none' : 'pointer'
												}}
												onClick={!isDisabled ? e => chooseDuration(e.target.textContent, index) : null}
												onMouseEnter={() => handleMouseEnter(index)}
												onMouseLeave={handleMouseLeave}
											>
												<span style={{ fontWeight: 'bolder' }}>{d.nights}</span>
												{` ${getNightsText(d.nights)} / ${d.days} ${getDaysText(d.days)}`}
											</li>
										)
									})}
								</ul>
							</div>
						</div>
					</div>
				)}
				{isDurationMobile && isMobileShow && (
					<div className={styles.wrapperDivModal}>
						<div className={styles.wrapperHeaderModal}>
							<div className={styles.modalHeader}>
								<span style={{ fontWeight: 'bold' }}>Тривалість</span>
								<span
									style={{ fontWeight: 'bold', cursor: 'pointer' }}
									onClick={() => setIsDurationMobile(!isDurationMobile)}
								>
									X
								</span>
							</div>
							{/* <div className={styles.blockSearchModal}>
								<div className={styles.formFieldModal}>
									<input
										ref={durationInputRef}
										className={styles.searchAir}
										type="search"
										placeholder={'на 6-8 ночей'}
										value={durationValue}
										onClick={handleDurationInputClick}
										readOnly
									/>
									<div className={styles.cnt} onClick={handleDurationInputClick}></div>
								</div>
							</div> */}
						</div>
						{openDurationForm && (
							<div className={styles.formListMobile}>
								<div className={styles.searchListModal}>
									<div className={styles.listCountry}>
										<ul style={{ listStyle: 'none', paddingLeft: '6px' }}>
											{tourDuration.map((d, index) => {
												const isDisabled =
													!localStorage.getItem('selectedResort') ||
													!JSON.parse(localStorage.getItem('selectedResort')).country

												return (
													<li
														key={`nights-${d.nights}-days-${d.days}`}
														style={{
															backgroundColor:
																selectDuration === index
																	? '#E2E8EF'
																	: hoveredItem === index
																	? '#F5F5F5'
																	: selectDuration === null && index === 5
																	? '#E2E8EF'
																	: '',
															padding: '6px',
															cursor: isDisabled ? 'none' : 'pointer'
														}}
														onClick={!isDisabled ? e => chooseDuration(e.target.textContent, index) : null}
														onMouseEnter={() => handleMouseEnter(index)}
														onMouseLeave={handleMouseLeave}
													>
														<span style={{ fontWeight: 'bolder' }}>{d.nights}</span>
														{` ${getNightsText(d.nights)} / ${d.days} ${getDaysText(d.days)}`}
													</li>
												)
											})}
										</ul>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	)
}

export default DurationSelect
