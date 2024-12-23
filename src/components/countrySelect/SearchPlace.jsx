import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useMediaQuery } from '../../method/useMediaQuery'
import CountryCitySearch from './CountryCitySearch'
import ModalSearchList from './ModalSearchList'
import SearchResort from './SearchResort'
import CountrySearch from './CountrySearch'
import ResortsList from './ResortList'
import { useResortsStore } from '../../store/store'
import { getData } from '../../method/fn'

import styles from './countrySelect.module.css'

function SearchPlace() {
	const [isOpen, setIsOpen] = useState(false)
	const [modalList, setModalList] = useState(false)
	const [isMobile, setIsMobile] = useState(false)
	const [isCityMobile, setIsCityMobile] = useState(false)
	const [showResults, setShowResults] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const {
		cities,
		countries,
		searchValue,
		placeholder,
		filteredObject,
		setPlaceholder,
		setSearchValue,
		setSelectedCountry,
		updateFilteredObject,
		setSelectAll,
		saveResortsResult,
		addedResort,
		addSelectedCountry,
		setCountries,
		setInitialCities
	} = useResortsStore()
	const isMobileResortsShow = useMediaQuery('(max-width: 768px)')

	const resortRef = useRef(null)

	useEffect(() => {
		const storedResult = JSON.parse(localStorage.getItem('selectedResort'))
		if (!storedResult) {
			setPlaceholder('Країна, курорт, готель')
			localStorage.setItem('selectedResort', JSON.stringify({ country: '', cities: [] }))
		}
	}, [setPlaceholder])

	useEffect(() => {
		setIsLoading(true)
		getData('/fakecountry.json')
			.then(data => {
				setCountries(data.countryList)
				setIsLoading(false)
			})
			.catch(error => {
				setIsLoading(false)
				console.error('Error fetching data:', error)
			})
	}, [setCountries])

	useEffect(() => {
		getData('/fakecity.json')
			.then(data => setInitialCities(data.cityLists))
			.catch(error => console.error('Error fetching data:', error))
	}, [setInitialCities])

	const handleInputClick = () => {
		if (isMobileResortsShow) {
			setIsMobile(true)
			setModalList(true)
		} else {
			setIsOpen(!isOpen)
		}
		setSelectAll(true)
	}

	const handleInputChange = e => {
		const value = e.target.value
		setSearchValue(value)
		updateFilteredObject(countries, cities, value)
		setShowResults(value.trim().length > 0)

		if (isMobileResortsShow) {
			setModalList(false)
			setIsCityMobile(false)
		} else {
			setIsOpen(false)
		}
	}

	const saveChooseResort = useCallback(() => {
		saveResortsResult()
		if (isMobileResortsShow) {
			setIsMobile(false)
			setModalList(false)
			setIsCityMobile(false)
			setIsCityMobile(false)
		} else {
			setIsOpen(false)
		}
	}, [isMobileResortsShow, saveResortsResult])

	const handleOutsideClick = useCallback(
		event => {
			if (resortRef.current && !resortRef.current.contains(event.target)) {
				setIsOpen(false)
				setShowResults(false)
				saveChooseResort()
			}
		},
		[setIsOpen, setShowResults, saveChooseResort]
	)

	const chooseCountry = country => {
		setTimeout(() => {
			addSelectedCountry(country)
			setShowResults(false)
			if (isMobileResortsShow) {
				setModalList(false)
				setIsCityMobile(true)
			} else {
				setIsOpen(true)
			}
		}, 0)
	}

	const chooseResort = city => {
		setTimeout(() => {
			addedResort(city)
			setShowResults(false)
			if (isMobileResortsShow) {
				setIsMobile(false)
				setModalList(false)
				setIsCityMobile(false)
			}
		}, 0)
	}

	useEffect(() => {
		const handleClick = event => handleOutsideClick(event)

		if (isOpen || showResults) {
			document.addEventListener('click', handleClick)
		}

		return () => {
			document.removeEventListener('click', handleClick)
		}
	}, [handleOutsideClick, isOpen, showResults])

	const handleCountrySelection = countryId => {
		setSelectedCountry(countryId)
		setSelectAll(true)
		if (isMobileResortsShow) {
			setModalList(false)
			setIsCityMobile(true)
		}
	}

	const closeModal = () => {
		saveChooseResort()
		setIsMobile(false)
		setModalList(false)
		setIsCityMobile(false)
		setIsOpen(false)
		setIsCityMobile(false)
		setSearchValue('')
	}

	return (
		<>
			<div className={styles.wrapperDiv} ref={resortRef}>
				<div className={styles.formField}>
					<input
						className={styles.searchPlace}
						type="search"
						placeholder={placeholder}
						value={searchValue}
						onChange={handleInputChange}
						onClick={handleInputClick}
					/>
					<div className={styles.cnt} onClick={handleInputClick}></div>
				</div>
				{!isMobileResortsShow && showResults && searchValue !== '' ? (
					<div className={styles.formList}>
						<div className={styles.searchListSelect}>
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

				{!isMobileResortsShow && isOpen && countries.length > 0 && cities.length > 0 && (
					<div className={styles.formList}>
						<div className={styles.searchList}>
							<CountryCitySearch handleCountrySelection={handleCountrySelection} isLoading={isLoading} />
							<div className={styles.resortWrapper}>
								<ResortsList />
								<button className={styles.btnResult} onClick={saveChooseResort}>
									OK
								</button>
							</div>
						</div>
					</div>
				)}

				{isMobileResortsShow && isMobile && (
					<ModalSearchList
						closeModal={closeModal}
						showResults={showResults}
						handleInputClick={handleInputClick}
						handleInputChange={handleInputChange}
						handleCountrySelection={handleCountrySelection}
						modalList={modalList}
						saveChooseResort={saveChooseResort}
						isCityMobile={isCityMobile}
						chooseCountry={chooseCountry}
						chooseResort={chooseResort}
						isLoading={isLoading}
					/>
				)}
			</div>
		</>
	)
}

export default SearchPlace
