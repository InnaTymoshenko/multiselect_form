import { useResortsStore } from '../../store/store'
import { useMediaQuery } from '../../method/useMediaQuery'
import Loader from '../Loader'

import styles from './countrySelect.module.css'

const ResortsList = ({ handleSelectAll, handleCitySelection, handleResortResult }) => {
	const { selectAll, selectedCities, filteredCities, isLoadingCities } = useResortsStore()
	const isMobileResortsShow = useMediaQuery('(max-width: 768px)')

	return (
		<>
			<div className={styles.resortWrapper}>
				{isLoadingCities ? <Loader /> : null}
				{filteredCities && (
					<div className={styles.listResorts}>
						<div style={{ padding: '10px' }}>
							<input type="checkbox" id="select-all" checked={selectAll} onChange={handleSelectAll} />
							<label htmlFor="select-all" style={{ marginLeft: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
								Всі курорти
							</label>
						</div>
						<ul style={{ listStyle: 'none', padding: 0 }}>
							{filteredCities &&
								filteredCities.map(city => (
									<li key={city.id} style={{ padding: '10px' }}>
										<input
											type="checkbox"
											id={`city-${city.id}`}
											checked={selectedCities.includes(city.id)}
											onChange={() => handleCitySelection(city.id)}
										/>
										<label htmlFor={`city-${city.id}`} style={{ marginLeft: '8px', cursor: 'pointer' }}>
											{city.name}
										</label>
									</li>
								))}
						</ul>
					</div>
				)}
				{isMobileResortsShow ? (
					<button className={styles.btnResultSave} onClick={handleResortResult}>
						Застосувати
					</button>
				) : (
					<button className={styles.btnResult} onClick={handleResortResult}>
						OK
					</button>
				)}
			</div>
		</>
	)
}

export default ResortsList
