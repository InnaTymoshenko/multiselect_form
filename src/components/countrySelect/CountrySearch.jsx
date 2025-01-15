import { useMouseEvents } from '../../method/useMouseEvents'
import SearchResort from './SearchResort'
import { useResortsStore } from '../../store/store'

import styles from './countrySelect.module.css'

const CountrySearch = ({ chooseCountry, chooseResort }) => {
	const { searchResults } = useResortsStore()
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()

	return (
		<>
			{searchResults.countries.length > 0 && (
				<>
					<p className={styles.selectCountry}>Країни:</p>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{searchResults.countries.map((country, ind) => (
							<li
								key={`${country.name}-selected-${ind}`}
								onClick={() => chooseCountry(country)}
								style={{
									padding: '10px',
									cursor: 'pointer',
									backgroundColor: hoveredItem === country.id ? '#F5F5F5' : ''
								}}
								onMouseEnter={() => handleMouseEnter(country.id)}
								onMouseLeave={handleMouseLeave}
							>
								{country.name}
							</li>
						))}
					</ul>
				</>
			)}
			{searchResults.cities.length > 0 && <SearchResort searchResults={searchResults} chooseResort={chooseResort} />}
		</>
	)
}

export default CountrySearch
