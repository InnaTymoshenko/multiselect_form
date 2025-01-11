import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import AirFiltered from './AirFiltered'
import { useAirportSelectStore } from '../../store/store'

import styles from './airSelect.module.css'

const AirMobile = ({
	setIsAirMobile,
	isAirMobile,
	showAir,
	handleAirChange,
	handleAirInputClick,
	chooseAir,
	filteredAir,
	isLoading
}) => {
	const [userInitiatedFocus, setUserInitiatedFocus] = useState(false)
	const { airValue, placeholder } = useAirportSelectStore()
	const airInputRef = useRef(null)

	useEffect(() => {
		if (showAir) {
			if (airInputRef.current && !userInitiatedFocus) airInputRef.current.blur()
		}
	}, [showAir, userInitiatedFocus])

	return (
		<div className={styles.wrapperDivModal}>
			<div className={styles.wrapperHeaderModal}>
				<div className={styles.modalHeader}>
					<span style={{ fontWeight: 'bold' }}>Відправлення з</span>
					<MdOutlineClose className={styles.iconClose} onClick={() => setIsAirMobile(!isAirMobile)} />
				</div>
				<div className={styles.blockSearchModal}>
					<div className={styles.formFieldModal}>
						<input
							ref={airInputRef}
							className={styles.searchAir}
							type="search"
							placeholder={placeholder}
							value={airValue}
							onChange={handleAirChange}
							onClick={() => {
								handleAirInputClick()
								setUserInitiatedFocus(true)
							}}
						/>
						<div className={styles.cnt} onClick={handleAirInputClick}></div>
					</div>
				</div>
			</div>
			{showAir && (
				<div className={styles.formListMobile}>
					<div className={styles.searchListModal}>
						<AirFiltered filteredAir={filteredAir} chooseAir={chooseAir} isLoading={isLoading} />
					</div>
				</div>
			)}
		</div>
	)
}

export default AirMobile
