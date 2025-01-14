import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import ResortsList from './ResortList'
import CountrySearch from './CountrySearch'
import SearchResort from './SearchResort'
import CountryCitySearch from './CountryCitySearch'
import { useResortsStore } from '../../store/store'

import styles from './countrySelect.module.css'

const ModalSearchList = ({
	closeModal,
	showResults,
	handleSearchChange,
	handleInputClick,
	handleCountrySelection,
	modalList,
	handleResortResult,
	isCityMobile,
	chooseCountry,
	chooseResort,
	handleSelectAll,
	handleCitySelection
}) => {
	const [userInitiatedFocus, setUserInitiatedFocus] = useState(false)
	const countryMobileRef = useRef()
	const { countries, cities, searchValue, placeholder, searchResults, selectedCountry } = useResortsStore()

	useEffect(() => {
		if (modalList || isCityMobile || showResults) {
			if (countryMobileRef.current && !userInitiatedFocus) {
				countryMobileRef.current.blur()
			}
		}
	}, [isCityMobile, modalList, showResults, userInitiatedFocus])

	return (
		<div className={styles.wrapperDivModal}>
			<div className={styles.wrapperHeaderModal}>
				<div className={styles.modalHeader}>
					<span style={{ fontWeight: 'bold' }}>Куди</span>
					<MdOutlineClose className={styles.iconClose} onClick={() => closeModal()} />
				</div>
				<div className={styles.blockSearchModal}>
					<div className={styles.formFieldModal}>
						<input
							ref={countryMobileRef}
							className={styles.searchPlace}
							type="search"
							placeholder={placeholder}
							value={searchValue}
							onChange={e => handleSearchChange(e)}
							onClick={() => {
								handleInputClick()
								setUserInitiatedFocus(true)
							}}
						/>
					</div>
				</div>
			</div>

			{modalList && countries.length > 0 && cities.length > 0 && (
				<div className={styles.formListModal} tabIndex="-1">
					<div className={styles.searchListModal}>
						<CountryCitySearch
							handleCountrySelection={handleCountrySelection}
							countries={countries}
							selectedCountry={selectedCountry}
						/>
					</div>
				</div>
			)}
			{isCityMobile && countries.length > 0 && cities.length > 0 && (
				<div className={styles.resortWrapper} tabIndex="-1">
					<ResortsList
						handleSelectAll={handleSelectAll}
						handleCitySelection={handleCitySelection}
						handleResortResult={handleResortResult}
					/>
				</div>
			)}
			{showResults && searchValue !== '' ? (
				<div className={styles.formListModal}>
					<div className={styles.searchListSelectModal}>
						<CountrySearch chooseCountry={chooseCountry} chooseResort={chooseResort} />
						{searchResults.countries.length === 0 && searchResults.cities.length > 0 && (
							<SearchResort chooseResort={chooseResort} />
						)}
					</div>
				</div>
			) : null}
		</div>
	)
}

export default ModalSearchList
