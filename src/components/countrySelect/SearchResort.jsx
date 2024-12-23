import React from 'react'

import styles from './countrySelect.module.css'

const SearchResort = ({ filteredObject, onClick }) => {
	return (
		<div>
			<div className={styles.selectCountry}>Курорти</div>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{filteredObject.cities.map(city => (
					<li
						key={`${city.name}-selected`}
						onClick={() => onClick(city)}
						style={{
							padding: '10px',
							cursor: 'pointer'
						}}
					>
						{`${city.name}, ${city.country.name}`}
					</li>
				))}
			</ul>
		</div>
	)
}

export default SearchResort
