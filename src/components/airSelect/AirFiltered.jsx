import React from 'react'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useAirportSelectStore } from '../../store/store'
import Loader from '../Loader'

import styles from './airSelect.module.css'

const AirFiltered = ({ filteredAir, chooseAir, isLoading }) => {
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()
	const { airports, selectedAir } = useAirportSelectStore()

	return (
		<div className={styles.listCountry}>
			<ul style={{ listStyle: 'none', paddingLeft: '6px' }}>
				{isLoading && <Loader />}
				{airports.length > 0 &&
					filteredAir &&
					filteredAir.length !== 0 &&
					filteredAir.map(air => {
						const isDisabled =
							!sessionStorage.getItem('selectedResort') || !JSON.parse(sessionStorage.getItem('selectedResort')).country
						return (
							<li
								key={`${air.name}-${air.code}`}
								style={{
									backgroundColor:
										selectedAir === air.id
											? '#E2E8EF'
											: hoveredItem === air.id
											? '#F5F5F5'
											: selectedAir === null && air.id === 1
											? '#E2E8EF'
											: '',
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
