import React, { useRef, useState, useEffect } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { MdOutlineClose } from 'react-icons/md'
import { useMediaQuery } from '../../method/useMediaQuery'
import { useTravelersStore, useResortsStore } from '../../store/store'
import TravelersForm from './TravelersForm'

import styles from './travelersSelect.module.css'

const TravelersSelect = () => {
	const [isChildren, setIsChildren] = useState(false)
	const [isTravelerForm, setIsTravelerForm] = useState(false)
	const [travelersMobile, setTravelersMobile] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const { selectedCountry } = useResortsStore()
	const {
		setSelectedAdult,
		touristsResult,
		addChildNumber,
		travelersValue,
		removeChild,
		updateTravelersValue,
		setTouristsResult
	} = useTravelersStore()

	const travelersRef = useRef()

	useEffect(() => {
		const storedResult = JSON.parse(localStorage.getItem('selectedTourists'))
		if (!storedResult) {
			localStorage.setItem('selectedTourists', JSON.stringify(null))
		}
	}, [])

	useEffect(() => {
		if (selectedCountry) {
			localStorage.setItem('selectedTourists', JSON.stringify('2'))
		}
	}, [selectedCountry])

	const handleTrevelersInputClick = () => {
		if (isMobileShow) {
			setIsTravelerForm(true)
			setTravelersMobile(true)
		} else {
			setIsTravelerForm(!isTravelerForm)
			setIsChildren(false)
			setTravelersMobile(false)
		}
	}

	const handleOutsideClickTravelers = event => {
		if (travelersRef.current && !travelersRef.current.contains(event.target)) {
			setIsTravelerForm(false)
		}
	}

	useEffect(() => {
		if (isTravelerForm) {
			document.addEventListener('click', handleOutsideClickTravelers)
		} else {
			document.removeEventListener('click', handleOutsideClickTravelers)
		}

		return () => {
			document.removeEventListener('click', handleOutsideClickTravelers)
		}
	}, [isTravelerForm])

	const openChildrenForm = e => {
		e.stopPropagation()
		setIsChildren(!isChildren)
	}

	const handleSelectedAdult = value => {
		setSelectedAdult(value)
		updateTravelersValue()
		setTouristsResult()
	}

	const handleSelectChild = (e, value) => {
		e.stopPropagation()
		setIsChildren(false)
		addChildNumber(value)
		updateTravelersValue()
		setTouristsResult()
	}

	const handleRemoveChild = (e, value) => {
		e.stopPropagation()
		removeChild(value)
		updateTravelersValue()
		setTouristsResult()

		const newTouristsResult = touristsResult.filter((item, index) => index === 0 || item !== value)
		const adults = parseInt(newTouristsResult[0] || 2, 10)
		const childrenCount = newTouristsResult.length - 1
		const totalTourists = adults + childrenCount

		if (totalTourists <= 6) {
			setShowModal(false)
		}
	}

	return (
		<div className={styles.wrapperDiv} ref={travelersRef}>
			<div className={styles.formField} tabIndex="-1">
				<input
					className={styles.searchAir}
					type="search"
					placeholder={'2 дорослих'}
					value={travelersValue}
					onClick={handleTrevelersInputClick}
					readOnly
				/>
				<BiSolidDownArrow className={styles.formIcon} onClick={handleTrevelersInputClick} />
			</div>
			{isTravelerForm && !isMobileShow && (
				<div className={styles.formList}>
					<div className={styles.searchList} tabIndex={'-1'}>
						<div className={styles.listCountry}>
							<div className={styles.travelBlockWrapper}>
								<TravelersForm
									openChildrenForm={openChildrenForm}
									isChildren={isChildren}
									handleSelectedAdult={handleSelectedAdult}
									handleSelectChild={handleSelectChild}
									handleRemoveChild={handleRemoveChild}
									setShowModal={setShowModal}
									showModal={showModal}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			{travelersMobile && isMobileShow && (
				<div className={styles.wrapperDivModal} tabIndex={'-1'}>
					<div className={styles.wrapperHeaderModal}>
						<div className={styles.modalHeader}>
							<span style={{ fontWeight: 'bold' }}>Туристи</span>
							<MdOutlineClose className={styles.iconClose} onClick={() => setTravelersMobile(!travelersMobile)} />
						</div>
					</div>
					<div className={styles.formListMobile}>
						<div className={styles.searchListModal}>
							<TravelersForm
								openChildrenForm={openChildrenForm}
								isChildren={isChildren}
								handleSelectedAdult={handleSelectedAdult}
								handleSelectChild={handleSelectChild}
								handleRemoveChild={handleRemoveChild}
								setShowModal={setShowModal}
								showModal={showModal}
							/>
						</div>
						<button className={styles.btnResultSave} onClick={() => setTravelersMobile(!travelersMobile)}>
							Застосувати
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default TravelersSelect
