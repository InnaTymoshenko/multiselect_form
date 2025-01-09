import React, { useEffect, useRef } from 'react'
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
	const { airValue, placeholder } = useAirportSelectStore()
	const airInputRef = useRef(null)

	useEffect(() => {
		if (showAir && airInputRef.current) {
			airInputRef.current.focus()
		}
	}, [showAir])

	return (
		<div className={styles.wrapperDivModal}>
			<div className={styles.wrapperHeaderModal}>
				<div className={styles.modalHeader}>
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
							onClick={handleAirInputClick}
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
