import React from 'react'
import { useMouseEvents } from '../../method/useMouseEvents'

import styles from './countrySelect.module.css'

const CountrySearch = ({ filteredObject, chooseCountry, chooseResort }) => {
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()

	return (
		<>
			<div className={styles.selectCountry}>Країна</div>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{filteredObject.countries.map(country => (
					<li
						key={`${country.name}-selected`}
						style={{
							padding: '10px',
							cursor: 'pointer',
							backgroundColor: hoveredItem === country.id ? '#F5F5F5' : ''
						}}
						onClick={e => chooseCountry(country)}
						onMouseEnter={() => handleMouseEnter(country.id)}
						onMouseLeave={handleMouseLeave}
					>
						{country.name}
					</li>
				))}
			</ul>
			<div className={styles.selectCountry}>Курорти</div>
			<div className={styles.selectCountryResorts}>
				{filteredObject.countries.map(country => (
					<div key={`${country.name}-selected-city`}>
						{country.cities.length > 0 ? (
							<ul style={{ listStyle: 'none', padding: 0, height: '100%' }}>
								{country.cities.map(c => (
									<li
										style={{
											minHeight: '100%',
											padding: '10px',
											cursor: 'pointer',
											backgroundColor: hoveredItem === c.id ? '#F5F5F5' : ''
										}}
										key={`${c.name}-${country.name}`}
										onClick={() => chooseResort(c)}
										onMouseEnter={() => handleMouseEnter(c.id)}
										onMouseLeave={handleMouseLeave}
									>{`${c.name}, ${country.name}`}</li>
								))}
							</ul>
						) : null}
					</div>
				))}
			</div>
		</>
	)
}

export default CountrySearch
