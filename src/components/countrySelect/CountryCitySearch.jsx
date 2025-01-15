import { useMouseEvents } from '../../method/useMouseEvents'
import { useResortsStore } from '../../store/store'
import Loader from '../Loader'

import styles from './countrySelect.module.css'

const CountryCitySearch = ({ handleCountrySelection }) => {
	const { countries, selectedCountry, isLoadingCountries } = useResortsStore()
	const { hoveredItem, handleMouseEnter, handleMouseLeave } = useMouseEvents()

	return (
		<>
			<div className={styles.listCountry}>
				{isLoadingCountries ? <Loader /> : null}
				{countries.length > 0 && (
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{countries.map(country => (
							<li
								key={country.id}
								onClick={() => handleCountrySelection(country.id)}
								onMouseEnter={() => handleMouseEnter(country.id)}
								onMouseLeave={handleMouseLeave}
								style={{
									padding: '10px',
									cursor: 'pointer',
									backgroundColor:
										selectedCountry === country.id
											? '#E2E8EF'
											: hoveredItem === country.id
											? '#F5F5F5'
											: selectedCountry === null && country.id === 1
											? '#E2E8EF'
											: ''
								}}
							>
								{country.name}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	)
}

export default CountryCitySearch

// {
// 	/* <div className={styles.listCountry}>
// <ul style={{ listStyle: 'none', padding: 0 }}>
// 	{isLoading && <Loader />}
// 	{countries.map(country => (
// 		<li
// 			key={country.id}
// 			onClick={() => handleCountrySelection(country.id)}
// 			onMouseEnter={() => handleMouseEnter(country.id)}
// 			onMouseLeave={handleMouseLeave}
// 			style={{
// 				padding: '10px',
// 				cursor: 'pointer',
// 				backgroundColor:
// 					selectedCountry === country.id
// 						? '#E2E8EF'
// 						: hoveredItem === country.id
// 						? '#F5F5F5'
// 						: selectedCountry === null && country.id === 1
// 						? '#E2E8EF'
// 						: ''
// 			}}
// 		>
// 			{country.name}
// 		</li>
// 	))}
// </ul>
// </div> */
// }
