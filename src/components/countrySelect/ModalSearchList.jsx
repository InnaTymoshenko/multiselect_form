import React from 'react'
import ResortsList from './ResortList'
import CountrySearch from './CountrySearch'
import SearchResort from './SearchResort'
import CountryCitySearch from './CountryCitySearch'
import { useResortsStore } from '../../store/store'

import styles from './countrySelect.module.css'

const ModalSearchList = ({
	closeModal,
	showResults,
	handleInputChange,
	handleInputClick,
	handleCountrySelection,
	modalList,
	saveChooseResort,
	isCityMobile,
	chooseCountry,
	chooseResort,
	isLoading
}) => {
	const { searchValue, placeholder, filteredObject, cities, countries } = useResortsStore()

	return (
		<div className={styles.wrapperDivModal}>
			<div className={styles.wrapperHeaderModal}>
				<div className={styles.modalHeader}>
					<span style={{ fontWeight: 'bold' }}>Куди</span>
					<span style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => closeModal()}>
						X
					</span>
				</div>
				<div className={styles.blockSearchModal}>
					<div className={styles.formFieldModal}>
						<input
							className={styles.searchPlace}
							type="search"
							placeholder={placeholder}
							value={searchValue}
							onChange={e => handleInputChange(e)}
							onClick={() => handleInputClick()}
						/>
					</div>
				</div>
			</div>

			{modalList && countries.length > 0 && cities.length > 0 && (
				<div className={styles.formListModal}>
					<div className={styles.searchListModal}>
						<CountryCitySearch handleCountrySelection={handleCountrySelection} isLoading={isLoading} />
					</div>
				</div>
			)}
			{isCityMobile && countries.length > 0 && cities.length > 0 && (
				<div className={styles.resortWrapper}>
					<ResortsList />
					<div className={styles.modalBtns}>
						<button className={styles.btnResultSave} onClick={() => saveChooseResort()}>
							Застосувати
						</button>
					</div>
				</div>
			)}
			{showResults && searchValue !== '' ? (
				<div className={styles.formListModal}>
					<div className={styles.searchListSelectModal}>
						{filteredObject && filteredObject.countries.length > 0 && (
							<CountrySearch
								filteredObject={filteredObject}
								chooseCountry={chooseCountry}
								chooseResort={chooseResort}
							/>
						)}
						{filteredObject && filteredObject.countries.length === 0 && filteredObject.cities.length > 0 && (
							<SearchResort filteredObject={filteredObject} onClick={chooseResort} />
						)}
					</div>
				</div>
			) : null}
		</div>
	)
}

export default ModalSearchList
