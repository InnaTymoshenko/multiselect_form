import React from 'react'
import { MdOutlineClose } from 'react-icons/md'
import TourDurationItems from './TourDurationItems'

import styles from './durationSelect.module.css'

const DurationMobile = ({ setIsDurationMobile, isDurationMobile, openDurationForm, chooseDuration }) => {
	return (
		<div className={styles.wrapperDivModal}>
			<div className={styles.wrapperHeaderModal}>
				<div className={styles.modalHeader}>
					<span style={{ fontWeight: 'bold' }}>Тривалість</span>
					<MdOutlineClose className={styles.iconClose} onClick={() => setIsDurationMobile(!isDurationMobile)} />
				</div>
			</div>
			{openDurationForm && (
				<div className={styles.formListMobile}>
					<div className={styles.searchListModal}>
						<TourDurationItems chooseDuration={chooseDuration} />
					</div>
				</div>
			)}
		</div>
	)
}

export default DurationMobile
