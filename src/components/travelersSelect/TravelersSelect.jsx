import React, { useRef, useState, useEffect } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { MdOutlineClose } from 'react-icons/md'
import { useMediaQuery } from '../../method/useMediaQuery'
import TravelersForm from './TravelersForm'

import styles from './travelersSelect.module.css'

const TravelersSelect = () => {
	const [isChildren, setIsChildren] = useState(false)
	const [isTravelerForm, setIsTravelerForm] = useState(false)
	const [travelersMobile, setTravelersMobile] = useState(false)
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const travelersRef = useRef()

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

	return (
		<div className={styles.wrapperDiv} ref={travelersRef}>
			<div className={styles.formField} tabIndex="-1">
				<input
					className={styles.searchAir}
					type="search"
					placeholder={'2 дорослих'}
					value={''}
					onChange={() => {}}
					onClick={handleTrevelersInputClick}
					tabIndex="-1"
				/>
				<BiSolidDownArrow className={styles.formIcon} onClick={handleTrevelersInputClick} />
			</div>
			{isTravelerForm && !isMobileShow && (
				<div className={styles.formList}>
					<div className={styles.searchList} tabIndex={'-1'}>
						<div className={styles.listCountry}>
							<div className={styles.travelBlockWrapper}>
								<TravelersForm openChildrenForm={openChildrenForm} isChildren={isChildren} />
							</div>
						</div>
					</div>
				</div>
			)}
			{travelersMobile && isMobileShow && (
				<div className={styles.wrapperDivModal}>
					<div className={styles.wrapperHeaderModal}>
						<div className={styles.modalHeader}>
							<span style={{ fontWeight: 'bold' }}>Туристи</span>
							<MdOutlineClose className={styles.iconClose} onClick={() => setTravelersMobile(!travelersMobile)} />
						</div>
					</div>
					{/* {openDurationForm && ( )} */}
					<div className={styles.formListMobile}>
						<div className={styles.searchListModal}>
							<TravelersForm openChildrenForm={openChildrenForm} isChildren={isChildren} />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default TravelersSelect
