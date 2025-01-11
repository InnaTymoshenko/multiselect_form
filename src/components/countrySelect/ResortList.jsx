import React, { useEffect, useState } from 'react'
import { useResortsStore } from '../../store/store'
import { useMediaQuery } from '../../method/useMediaQuery'

import styles from './countrySelect.module.css'

const ResortsList = ({ saveChooseResort }) => {
	const [localSelectedCities, setLocalSelectedCities] = useState([])
	const [localCountry, setLocalCountry] = useState(1)
	const isMobileResortsShow = useMediaQuery('(max-width: 768px)')

	const { filteredCities, selectedCountry, selectAll, setSelectAll, cities, setSelectedCities, updatePlaceholder } =
		useResortsStore()

	useEffect(() => {
		if (selectedCountry === null) {
			const defaultCities = cities.filter(city => city.country === localCountry).map(city => city.id)
			setLocalSelectedCities(defaultCities)
			setSelectedCities(defaultCities)
		} else if (filteredCities.length > 0) {
			const selectedCityIds = filteredCities.map(city => city.id)
			setLocalSelectedCities(selectedCityIds)
			setSelectedCities(selectedCityIds)
			setLocalCountry(null)
		} else {
			setLocalSelectedCities([])
		}
		updatePlaceholder()
	}, [filteredCities, selectedCountry, cities, setSelectedCities, updatePlaceholder, localCountry])

	const handleCitySelection = cityId => {
		if (localSelectedCities.includes(cityId)) {
			const updatedSelection = localSelectedCities.filter(id => id !== cityId)
			setLocalSelectedCities(updatedSelection)
			setSelectedCities(updatedSelection)
			setSelectAll(false)
		} else {
			const updatedSelection = [...localSelectedCities, cityId]
			setLocalSelectedCities(updatedSelection)
			setSelectedCities(updatedSelection)
			setSelectAll(updatedSelection.length === filteredCities.length)
		}
		updatePlaceholder()
	}

	const handleSelectAll = () => {
		if (selectAll) {
			setLocalSelectedCities([])
			setSelectedCities([])
			setSelectAll(false)
		} else {
			const allCityIds =
				selectedCountry === null
					? cities.filter(city => city.country === localCountry).map(city => city.id)
					: filteredCities.map(city => city.id)
			setLocalSelectedCities(allCityIds)
			setSelectedCities(allCityIds)
			setSelectAll(true)
		}
		updatePlaceholder()
	}

	return (
		<>
			<div className={styles.listResorts}>
				{filteredCities.length > 0 || selectedCountry === null ? (
					<>
						<div style={{ padding: '10px' }}>
							<input type="checkbox" id="select-all" checked={selectAll} onChange={handleSelectAll} />
							<label htmlFor="select-all" style={{ marginLeft: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
								Всі курорти
							</label>
						</div>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							{(selectedCountry === null ? cities.filter(city => city.country === localCountry) : filteredCities).map(
								city => (
									<li key={city.id} style={{ padding: '10px', display: 'flex', alignItems: 'center' }}>
										<input
											type="checkbox"
											id={`city-${city.id}`}
											checked={localSelectedCities.includes(city.id)}
											onChange={() => handleCitySelection(city.id)}
										/>
										<label htmlFor={`city-${city.id}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
											{city.name}
										</label>
									</li>
								)
							)}
						</ul>
					</>
				) : null}
			</div>
			{isMobileResortsShow ? (
				<button
					className={styles.btnResultSave}
					onClick={() => saveChooseResort(selectedCountry || localCountry, localSelectedCities)}
				>
					Застосувати
				</button>
			) : (
				<button
					className={styles.btnResult}
					onClick={() => saveChooseResort(selectedCountry || localCountry, localSelectedCities)}
				>
					OK
				</button>
			)}
		</>
	)
}

export default ResortsList
