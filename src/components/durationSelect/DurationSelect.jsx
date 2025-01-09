import React, { useEffect, useRef, useState } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useMediaQuery } from '../../method/useMediaQuery'
import TourDurationItems from './TourDurationItems'
import DurationMobile from './DurationMobile'
import { useResortsStore, useTourDurationStore } from '../../store/store'

import styles from './durationSelect.module.css'

const DurationSelect = () => {
	const [openDurationForm, setOpenDurationForm] = useState(false)
	const [isDurationMobile, setIsDurationMobile] = useState(false)
	const { selectedCountry } = useResortsStore()
	const { setSelectDuration, selectTourDuration, durationValue } = useTourDurationStore()
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const durationRef = useRef(null)

	useEffect(() => {
		if (selectedCountry) {
			setSelectDuration(5)
		}
	}, [selectedCountry, setSelectDuration])

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

	const chooseDuration = index => {
		selectTourDuration(index)
		setOpenDurationForm(false)
		setIsDurationMobile(false)
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
							<TourDurationItems chooseDuration={chooseDuration} />
						</div>
					</div>
				)}
				{isDurationMobile && isMobileShow && (
					<DurationMobile
						setIsDurationMobile={setIsDurationMobile}
						isDurationMobile={isDurationMobile}
						openDurationForm={openDurationForm}
						chooseDuration={chooseDuration}
					/>
				)}
			</div>
		</>
	)
}

export default DurationSelect
