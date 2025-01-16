import React, { useEffect, useRef, useCallback, useState } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useMediaQuery } from '../../method/useMediaQuery'
import CountryCitySearch from './CountryCitySearch'
import ModalSearchList from './ModalSearchList'
import SearchResort from './SearchResort'
import CountrySearch from './CountrySearch'
import ResortsList from './ResortList'
import { useResortsStore } from '../../store/store'
import { CITY_API, COUNTRY_API } from '../../services/api'

import styles from './countrySelect.module.css'

function CountrySelect() {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [modalList, setModalList] = useState(false)
	const [isCityMobile, setIsCityMobile] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const {
		countries,
		cities,
		fetchCountries,
		fetchCities,
		errorCountries,
		errorCities,
		countrySelection,
		selectedCountry,
		setSelectedCountry,
		updateSelection,
		updateFilteredCities,
		selectAll,
		selectedCities,
		filteredCities,
		resortSearchValue,
		setSearchValue,
		searchValue,
		updateCountryResult,
		hasChanges,
		searchResults,
		placeholder,
		setPlaceholder,
		updatePlaceholder,
		saveCountryResult,
		saveResortsResult
	} = useResortsStore()
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const resortRef = useRef(null)

	useEffect(() => {
		const storedResult = JSON.parse(sessionStorage.getItem('selectedResort'))
		if (!storedResult) {
			setPlaceholder('Країна, курорт, готель')
			sessionStorage.setItem('selectedResort', JSON.stringify({ country: '', cities: [] }))
		}
	}, [setPlaceholder])

	useEffect(() => {
		fetchCountries(COUNTRY_API)
	}, [fetchCountries])

	useEffect(() => {
		setTimeout(() => {
			fetchCities(CITY_API)
		}, 0)
	}, [fetchCities])

	useEffect(() => {
		if (selectedCountry && countries.length > 0) {
			updateFilteredCities()
		}
	}, [countries.length, selectedCountry, updateFilteredCities])

	const handleCountrySelection = countryId => {
		countrySelection(countryId)
		updatePlaceholder()
		if (isMobileShow) {
			setModalList(false)
			setIsCityMobile(true)
		}
	}

	const handleCitySelection = cityId => {
		const isCitySelected = selectedCities.includes(cityId)
		const updatedSelection = isCitySelected ? selectedCities.filter(id => id !== cityId) : [...selectedCities, cityId]
		updateSelection(updatedSelection)
	}

	const handleSelectAll = () => {
		if (selectAll) {
			updateSelection([])
		} else {
			const allCityIds = filteredCities.map(city => city.id)
			updateSelection(allCityIds)
		}
	}

	const handleSearchChange = e => {
		const value = e.target.value.toLowerCase()
		resortSearchValue(value)
		setShowResults(true)
		if (isMobileShow) {
			setModalList(false)
		} else {
			setIsFormOpen(false)
		}
	}

	const handleInputClick = () => {
		if (!isFormOpen && !isMobile) {
			setSelectedCountry(selectedCountry || 1)
			updateFilteredCities()
			updatePlaceholder()
		} else {
			if (hasChanges) {
				saveCountryResult()
			} else {
				saveCountryResult()
			}
		}
		if (isMobileShow) {
			setModalList(true)
			setIsMobile(true)
			setIsFormOpen(false)
			setIsCityMobile(false)
		} else {
			setIsFormOpen(!isFormOpen)
		}
	}

	const handleClickOutside = useCallback(
		event => {
			if (resortRef.current && !resortRef.current.contains(event.target)) {
				if (isFormOpen) {
					setIsFormOpen(false)
					if (hasChanges) {
						saveCountryResult()
					} else {
						saveCountryResult()
					}
				}
			}
		},
		[hasChanges, isFormOpen, saveCountryResult]
	)

	useEffect(() => {
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [handleClickOutside])

	const handleResortResult = () => {
		saveResortsResult()
		if (isMobileShow) {
			setIsCityMobile(false)
			setModalList(false)
			setIsMobile(false)
		} else {
			setIsFormOpen(false)
		}
	}

	const chooseResort = resort => {
		setTimeout(() => {
			updateCountryResult(resort.country, [resort.id])
			setPlaceholder(`${resort.countryName}: 1 курорт`)
			setSearchValue('')
			setShowResults(false)
			if (isMobileShow) {
				setIsMobile(false)
			}
		}, 0)
	}

	const chooseCountry = country => {
		setTimeout(() => {
			const cityIds = cities.filter(city => city.country === country.id).map(c => c.id)
			updateCountryResult(country.id, cityIds)
			setSearchValue('')
			setShowResults(false)
			if (isMobileShow) {
				setModalList(false)
				setIsCityMobile(true)
			} else {
				setIsFormOpen(true)
			}
		}, 0)
	}

	const closeModal = () => {
		if (hasChanges) {
			saveCountryResult()
		} else {
			saveCountryResult()
		}
		setIsMobile(false)
		setModalList(false)
		setIsCityMobile(false)
	}

	if (errorCountries) return console.error(errorCountries)
	if (errorCities) return console.error(errorCities)

	return (
		<div className={styles.wrapperDiv} ref={resortRef}>
			<div className={styles.formField} tabIndex="-1">
				<input
					className={styles.searchPlace}
					type="search"
					placeholder={placeholder}
					value={searchValue}
					onChange={handleSearchChange}
					onClick={handleInputClick}
				/>
				<div className={styles.cnt}>
					<BiSolidDownArrow className={styles.formIcon} onClick={handleInputClick} />
				</div>
			</div>
			{!isMobileShow && !showResults && isFormOpen && countries.length > 0 && (
				<div className={styles.formList}>
					<div className={styles.searchList}>
						<CountryCitySearch
							handleCountrySelection={handleCountrySelection}
							countries={countries}
							selectedCountry={selectedCountry}
						/>
						<ResortsList
							handleSelectAll={handleSelectAll}
							handleCitySelection={handleCitySelection}
							handleResortResult={handleResortResult}
						/>
					</div>
				</div>
			)}
			{!isMobileShow && !isFormOpen && showResults && searchValue && (
				<div className={styles.formList}>
					<div className={styles.searchListSelect}>
						<CountrySearch chooseCountry={chooseCountry} chooseResort={chooseResort} />
						{searchResults.countries.length === 0 && searchResults.cities.length > 0 && (
							<SearchResort chooseResort={chooseResort} />
						)}
					</div>
				</div>
			)}
			{isMobileShow && isMobile && (
				<ModalSearchList
					closeModal={closeModal}
					showResults={showResults}
					handleInputClick={handleInputClick}
					handleSearchChange={handleSearchChange}
					handleCountrySelection={handleCountrySelection}
					modalList={modalList}
					handleResortResult={handleResortResult}
					isCityMobile={isCityMobile}
					chooseCountry={chooseCountry}
					chooseResort={chooseResort}
					handleSelectAll={handleSelectAll}
					handleCitySelection={handleCitySelection}
				/>
			)}
		</div>
	)
}

export default CountrySelect
