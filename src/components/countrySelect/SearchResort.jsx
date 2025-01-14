import React from 'react'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useResortsStore } from '../../store/store'

import styles from './countrySelect.module.css'

const SearchResort = ({ chooseResort }) => {
	const { searchResults } = useResortsStore()
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()

	return (
		<>
			<p className={styles.selectCountry}>Курорти:</p>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{searchResults.cities.map((city, ind) => (
					<li
						key={`${city.name}-${ind}-selected`}
						onClick={() => chooseResort(city)}
						style={{
							minHeight: '100%',
							padding: '10px',
							cursor: 'pointer',
							backgroundColor: hoveredItem === city.id ? '#F5F5F5' : ''
						}}
						onMouseEnter={() => handleMouseEnter(city.id)}
						onMouseLeave={handleMouseLeave}
					>
						{city.name}, {city.countryName}
					</li>
				))}
			</ul>
		</>
	)
}

export default SearchResort
