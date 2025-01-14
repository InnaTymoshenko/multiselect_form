import React from 'react'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useTourDurationStore } from '../../store/store'
import { getDaysText, getNightsText } from '../../method/fn'

import styles from './durationSelect.module.css'

const TourDurationItems = ({ chooseDuration }) => {
	const { tourDuration, selectDuration } = useTourDurationStore()
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()

	return (
		<div className={styles.listCountry}>
			<ul style={{ listStyle: 'none', paddingLeft: '6px' }}>
				{tourDuration.map((d, index) => {
					const isDisabled =
						!sessionStorage.getItem('selectedResort') || !JSON.parse(sessionStorage.getItem('selectedResort')).country
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
							onClick={!isDisabled ? () => chooseDuration(index) : null}
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
	)
}

export default TourDurationItems
