import React from 'react'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useAirportSelectStore } from '../../store/store'
import Loader from '../Loader'

import styles from './airSelect.module.css'

const AirFiltered = ({ filteredAir, selectedAir, chooseAir, isLoading }) => {
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()
	const { airports } = useAirportSelectStore()

	return (
		<div className={styles.listCountry}>
			<ul style={{ listStyle: 'none', paddingLeft: 0 }}>
				{isLoading && <Loader />}
				{airports.length > 0 &&
					filteredAir.map(air => {
						const isDisabled =
							!localStorage.getItem('selectedResort') || !JSON.parse(localStorage.getItem('selectedResort')).country
						return (
							<li
								key={`${air.name}-${air.code}`}
								style={{
									backgroundColor: selectedAir === air.id ? '#E2E8EF' : hoveredItem === air.id ? '#F5F5F5' : '',
									padding: '6px',
									cursor: isDisabled ? 'none' : 'pointer'
								}}
								onMouseEnter={() => handleMouseEnter(air.id)}
								onMouseLeave={handleMouseLeave}
								onClick={!isDisabled ? e => chooseAir(e.target.textContent) : null}
							>{`${air.name}`}</li>
						)
					})}
			</ul>
		</div>
	)
}

export default AirFiltered
