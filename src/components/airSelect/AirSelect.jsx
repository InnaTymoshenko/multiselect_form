import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useMediaQuery } from '../../method/useMediaQuery'
import AirFiltered from './AirFiltered'
import AirMobile from './AirMobile'
import { useAirportSelectStore, useResortsStore } from '../../store/store'
import { AIR_API } from '../../services/api'

import styles from './airSelect.module.css'

const AirSelect = () => {
	const [filteredAir, setFilteredAir] = useState(null)
	const [showAir, setShowAir] = useState(false)
	const [isAirMobile, setIsAirMobile] = useState(false)
	const {
		setSelectedAir,
		airports,
		airValue,
		isLoading,
		setAirValue,
		filterAirportsByCountry,
		searchAirports,
		chooseAirport,
		placeholder,
		setUniqueAirports,
		setPlaceholder,
		fetchAirports
	} = useAirportSelectStore()
	const { selectedCountry, isSavedResortResult } = useResortsStore()
	const isMobileShow = useMediaQuery('(max-width: 768px)')
	const airRef = useRef(null)

	useEffect(() => {
		const storedResult = JSON.parse(sessionStorage.getItem('selectedAirport'))
		if (!storedResult) {
			setPlaceholder('з Кишинева')
			sessionStorage.setItem('selectedAirport', JSON.stringify({ id: '', name: '', code: '', country: '' }))
		}
	}, [setPlaceholder])

	useEffect(() => {
		fetchAirports(AIR_API)
	}, [fetchAirports])

	useEffect(() => {
		if (airports.length) {
			setUniqueAirports(airports)
		}
	}, [airports, setUniqueAirports])

	useEffect(() => {
		if (!selectedCountry || !airports.length) return
		const filteredAirports = airports.filter(air => air?.country === selectedCountry)
		if (filteredAirports.length > 0 && isSavedResortResult) {
			setPlaceholder(`з ${filteredAirports[0].name}`)
			sessionStorage.setItem(
				'selectedAirport',
				JSON.stringify({
					id: filteredAirports[0].id,
					name: filteredAirports[0].name,
					code: filteredAirports[0].code,
					country: filteredAirports[0].country
				})
			)
		} else {
			setPlaceholder('з Кишинева')
			sessionStorage.setItem(
				'selectedAirport',
				JSON.stringify({
					id: airports[0].id,
					name: airports[0].name,
					code: airports[0].code,
					country: airports[0].country
				})
			)
		}
	}, [airports, isSavedResortResult, selectedCountry, setPlaceholder])

	const handleAirInputClick = () => {
		const filteredAir = filterAirportsByCountry()
		setFilteredAir(filteredAir)
		setAirValue('')
		if (isMobileShow) {
			setIsAirMobile(true)
			setShowAir(true)
		} else {
			setIsAirMobile(false)
			setShowAir(!showAir)
		}
	}

	const handleAirChange = e => {
		const value = e.target.value
		setAirValue(`з ${value}`)
		const searchResults = searchAirports(value)
		setFilteredAir(searchResults)
	}

	const chooseAir = value => {
		const selectedAir = airports.find(air => air.name === value)
		chooseAirport(value)
		setShowAir(false)
		setIsAirMobile(false)
		setSelectedAir(selectedAir.id)
	}

	const handleOutsideClickAir = useCallback(
		event => {
			if (airRef.current && !airRef.current.contains(event.target)) {
				setShowAir(false)
				setAirValue('')
			}
		},
		[setAirValue]
	)

	useEffect(() => {
		if (showAir) {
			document.addEventListener('click', handleOutsideClickAir)
		} else {
			document.removeEventListener('click', handleOutsideClickAir)
		}

		return () => {
			document.removeEventListener('click', handleOutsideClickAir)
		}
	}, [handleOutsideClickAir, showAir])

	return (
		<div className={styles.wrapperDiv} ref={airRef}>
			<div className={styles.formField} tabIndex="-1">
				<input
					className={styles.searchAir}
					type="search"
					placeholder={placeholder}
					value={airValue}
					onChange={handleAirChange}
					onClick={handleAirInputClick}
					tabIndex="-1"
				/>
				<BiSolidDownArrow className={styles.formIcon} onClick={handleAirInputClick} />
			</div>
			{showAir && !isMobileShow && airports.length > 0 && (
				<div className={styles.formList}>
					<div className={styles.searchList}>
						<AirFiltered filteredAir={filteredAir} chooseAir={chooseAir} isLoading={isLoading} />
					</div>
				</div>
			)}
			{isAirMobile && isMobileShow && airports.length > 0 && (
				<AirMobile
					setIsAirMobile={setIsAirMobile}
					isAirMobile={isAirMobile}
					showAir={showAir}
					handleAirChange={handleAirChange}
					handleAirInputClick={handleAirInputClick}
					chooseAir={chooseAir}
					filteredAir={filteredAir}
					isLoading={isLoading}
				/>
			)}
		</div>
	)
}

export default AirSelect
