import { create } from 'zustand'
import { formatToStoreDate, getNightsText } from '../method/fn'
import { dataTourDuration } from '../data/duration'

export const useResortsStore = create((set, get) => ({
	countries: [],
	cities: [],
	searchValue: '',
	placeholder: 'Країна, курорт, готель',
	filteredObject: null,
	selectedCountry: null,
	selectedCities: [],
	result: { country: '', cities: [] },
	filteredCities: [],
	selectAll: true,
	setCountries: countries => set({ countries }),
	setInitialCities: cities => set({ cities }),
	setSelectAll: selectAll => set({ selectAll }),
	setSearchValue: searchValue => set({ searchValue }),
	setPlaceholder: placeholder => set({ placeholder }),
	setFilteredObject: filteredObject => set({ filteredObject }),
	setSelectedCities: selectedCities => set({ selectedCities }),
	setResult: result => set({ result }),
	saveResortsResult: () => {
		const { countries, setPlaceholder, setSearchValue, selectedCountry, selectedCities, setResult } = get()

		let tempResult
		let placeholderText

		const effectiveCountry = selectedCountry || 1
		const selectedCountryName = countries.find(country => country.id === effectiveCountry)?.name || ''

		if (selectedCities.length > 0) {
			tempResult = {
				country: effectiveCountry,
				cities: selectedCities
			}
			placeholderText = `${selectedCountryName}: ${selectedCities.length} ${
				selectedCities.length === 1 ? 'курорт' : 'курорта'
			}`
		} else {
			tempResult = {
				country: effectiveCountry,
				cities: []
			}
			placeholderText = selectedCountryName
		}

		setPlaceholder(placeholderText)
		setResult(tempResult)
		setSearchValue('')
		localStorage.setItem('selectedResort', JSON.stringify(tempResult))
	},
	addSelectedCountry: country => {
		const { setPlaceholder, setSelectedCountry, setSearchValue } = get()

		const tempResult = {
			country: country.id,
			cities: country.cities.map(city => city.id)
		}

		setPlaceholder(`${country.name}: ${country.cities.length} ${country.cities.length === 1 ? 'курорт' : 'курортів'}`)
		setSearchValue('')
		setSelectedCountry(country.id)
		set({
			result: tempResult
		})

		localStorage.setItem('selectedResort', JSON.stringify(tempResult))
	},
	addedResort: city => {
		const { setPlaceholder, setSelectedCountry, setSelectedCities, setSearchValue } = get()
		const tempResult = {
			country: city.country.id,
			cities: [city.id]
		}

		setSelectedCountry(tempResult.country)
		setSelectedCities(tempResult.cities)
		setPlaceholder(`${city.country.name}: 1 курорт`)
		setSearchValue('')
		set({
			result: tempResult
		})
		localStorage.setItem('selectedResort', JSON.stringify(tempResult))
	},
	updatePlaceholder: () => {
		const { countries, selectedCountry, selectedCities, setPlaceholder } = get()

		const currentCountry =
			countries.find(country => country.id === selectedCountry) || countries.find(country => country.id === 1)

		const countryName = currentCountry.name
		const cityCount = selectedCities.length

		let placeholderText

		if (cityCount > 0) {
			placeholderText = `${countryName}: ${cityCount} ${cityCount === 1 ? 'курорт' : 'курорта'}`
		} else {
			placeholderText = `${countryName}`
		}

		setPlaceholder(placeholderText)
	},
	updateFilteredObject: (countries, cities, searchValue) => {
		const matchedCountries = countries.filter(country => country.name.toLowerCase().includes(searchValue.toLowerCase()))

		const matchedCities = cities.filter(city => city.name.toLowerCase().includes(searchValue.toLowerCase()))

		const filteredObject = {
			searchValue,
			countries: matchedCountries.map(country => ({
				id: country.id,
				name: country.name,
				cities: cities
					.filter(city => city.country === country.id)
					.map(city => ({
						id: city.id,
						name: city.name,
						country: { id: country.id, name: country.name }
					}))
			})),
			cities: matchedCities
				.filter(city => !matchedCountries.some(country => country.id === city.country))
				.map(city => {
					const relatedCountry = countries.find(country => country.id === city.country)
					return {
						id: city.id,
						name: city.name,
						country: relatedCountry ? { id: relatedCountry.id, name: relatedCountry.name } : null
					}
				})
		}

		set({ filteredObject })
	},
	setCities: cities => set({ cities }),

	setSelectedCountry: countryId => {
		if (get().selectedCountry !== countryId) {
			const filtered = get().cities.filter(city => city.country === countryId)
			const filteredIds = filtered.map(city => city.id)

			set({
				selectedCountry: countryId,
				filteredCities: filtered,
				selectedCities: filteredIds
			})
		}
		localStorage.setItem('selectedResort', JSON.stringify({ country: countryId, cities: [...get().selectedCities] }))
	},
	resetSelectedResorts: () => {
		set({
			selectedCountry: null,
			selectedCities: [],
			filteredCities: [],
			placeholder: 'Країна, курорт, готель',
			result: { country: '', cities: [] },
			searchValue: ''
		})
		localStorage.setItem('selectedResort', JSON.stringify({ country: '', cities: [] }))
	}
}))

export const useAirportSelectStore = create((set, get) => ({
	airports: [],
	uniqueAirports: null,
	airValue: '',
	airResult: { id: '', name: '', code: '', country: '' },
	placeholder: '',
	selectedAir: null,
	setSelectedAir: selectedAir => set({ selectedAir }),
	setPlaceholder: placeholder => set({ placeholder }),
	setAirports: airports => set({ airports }),
	setUniqueAirports: () => {
		const { airports } = get()
		const filteredAir = Array.from(new Set(airports.map(airport => airport.id))).map(id =>
			airports.find(airport => airport.id === id)
		)
		set({
			uniqueAirports: filteredAir,
			placeholder: `з ${filteredAir[0].name}`
		})
	},
	setAirValue: value => set({ airValue: value }),
	setAirResult: result => set({ airResult: result }),
	filterAirportsByCountry: () => {
		const { airports, uniqueAirports, setSelectedAir } = get()
		const storedResort = JSON.parse(localStorage.getItem('selectedResort'))
		const storedAir = JSON.parse(localStorage.getItem('selectedAirport'))
		if (uniqueAirports !== null) {
			if (storedResort && storedResort.country) {
				const filteredAirports = airports.filter(air => air?.country === storedResort.country)
				if (filteredAirports.length === 0) {
					setSelectedAir(1)
					return uniqueAirports.sort((a, b) => a.name.localeCompare(b.name))
				}
				if (storedAir !== null && storedAir.id !== '') {
					setSelectedAir(storedAir.id)
					return filteredAirports.sort((a, b) => a.name.localeCompare(b.name))
				}
				setSelectedAir(filteredAirports[0].id)
				return filteredAirports.sort((a, b) => a.name.localeCompare(b.name))
			}
			setSelectedAir(1)
			return uniqueAirports.sort((a, b) => a.name.localeCompare(b.name))
		}
	},
	searchAirports: value => {
		const filteredAirports = get().filterAirportsByCountry()
		return filteredAirports.filter(air => air.name.toLowerCase().includes(value.toLowerCase()))
	},
	chooseAirport: value => {
		const airports = get().airports
		const tempSelectedAir = airports.find(air => air.name === value)

		if (tempSelectedAir) {
			set({
				airValue: '',
				airResult: tempSelectedAir,
				placeholder: `з ${value}`,
				selectedAir: tempSelectedAir.id
			})

			localStorage.setItem('selectedAirport', JSON.stringify(tempSelectedAir))
		}
	},
	resetAirports: () => {
		set({
			airValue: '',
			airResult: { id: '', name: '', code: '', country: '' },
			placeholder: `з Кишинева`
		})
		localStorage.setItem('selectedAirport', JSON.stringify({ id: '', name: '', code: '', country: '' }))
	}
}))

export const useDateStore = create((set, get) => ({
	startDate: {
		dateFrom: '',
		dateTo: ''
	},
	defaultStartDate: {
		dateFrom: '',
		dateTo: ''
	},
	hoverTempDate: { dateFrom: '', dateTo: '' },
	setHoverTempDate: (dateFrom, dateTo) => {
		set({
			hoverTempDate: {
				dateFrom: dateFrom,
				dateTo: dateTo
			}
		})
	},
	resetHoverTempDate: () => {
		set({
			hoverTempDate: { dateFrom: '', dateTo: '' }
		})
	},
	setDefaultStartDate: (dateFrom, dateTo) => {
		set({
			defaultStartDate: {
				dateFrom: dateFrom,
				dateTo: dateTo
			}
		})
	},
	resetDefaultStartDate: () => {
		set({
			defaultStartDate: { dateFrom: '', dateTo: '' }
		})
	},
	setStartDate: (dateFrom, dateTo) => {
		set({
			startDate: {
				dateFrom: dateFrom,
				dateTo: dateTo
			}
		})
	},
	resetStartDate: () => {
		set({
			startDate: { dateFrom: '', dateTo: '' }
		})
	},
	addedToLocalStorage: () => {
		const { startDate } = get()
		localStorage.setItem(
			'selectedDate',
			JSON.stringify({ dateFrom: formatToStoreDate(startDate.dateFrom), dateTo: formatToStoreDate(startDate.dateTo) })
		)
	},
	resetDates: () => {
		set({
			startDate: { dateFrom: '', dateTo: '' },
			defaultStartDate: { dateFrom: '', dateTo: '' },
			hoverTempDate: { dateFrom: '', dateTo: '' }
		})
		localStorage.setItem('selectedDate', JSON.stringify({ dateFrom: '', dateTo: '' }))
	}
}))

export const useTourDurationStore = create((set, get) => ({
	tourDuration: dataTourDuration,
	selectDuration: null,
	durationValue: '',
	tourDurationResult: null,
	setSelectDuration: selectDuration => set({ selectDuration }),
	selectTourDuration: index => {
		const { tourDuration } = get()
		const findDuration = tourDuration.find((d, i) => i === index)
		const tempDuration = {
			[index + 1]: findDuration.nights
		}
		set({
			durationValue: `на ${findDuration.nights} ${getNightsText(findDuration.nights)}`,
			tourDurationResult: tempDuration,
			selectDuration: index
		})
		localStorage.setItem('selectedDuration', JSON.stringify(tempDuration))
	},
	resetDuration: () => {
		set({
			durationValue: '',
			tourDurationResult: null,
			selectDuration: null
		})
		localStorage.setItem('selectedDuration', JSON.stringify(null))
	}
}))

export const useTravelersStore = create((set, get) => ({
	selectedAdult: null,
	childNumber: [],
	touristsResult: [],
	travelersValue: '',
	setTouristsResult: () => {
		const formattedResult = get().touristsResult.join('')
		localStorage.setItem('selectedTourists', JSON.stringify(formattedResult))
	},
	setSelectedAdult: value => {
		const { touristsResult } = get()
		const updatedResult = [...touristsResult]
		updatedResult[0] = value

		set({
			selectedAdult: value,
			touristsResult: updatedResult
		})
	},
	addChildNumber: value => {
		const { childNumber, touristsResult } = get()
		const formattedChildValue = value < 10 ? `0${value}` : `${value}`

		if (touristsResult.length === 0) {
			set({
				touristsResult: [2, formattedChildValue]
			})
		} else {
			set({
				touristsResult: [...touristsResult, formattedChildValue]
			})
		}

		set({ childNumber: [...childNumber, value] })
	},
	removeChild: value => {
		const { childNumber, touristsResult } = get()
		const formattedValue = value < 10 ? `0${value}` : `${value}`
		const index = childNumber.indexOf(value)

		if (index === -1) {
			set({
				childNumber,
				touristsResult
			})
		} else {
			const newArray = [...childNumber]
			newArray.splice(index, 1)
			const resultIndex = touristsResult.findIndex((item, idx) => idx !== 0 && item === formattedValue)
			const updatedTouristsResult = [...touristsResult]
			if (resultIndex !== -1) {
				updatedTouristsResult.splice(resultIndex, 1)
			}

			set({
				childNumber: newArray,
				touristsResult: updatedTouristsResult
			})
		}
	},
	updateTravelersValue: () => {
		const { touristsResult } = get()
		if (touristsResult.length === 0) {
			set({ travelersValue: '' })
		}

		const adults = touristsResult[0]
		const childrenCount = touristsResult.length - 1

		if (childrenCount === 0) {
			set({ travelersValue: `${adults} дорослих` })
		} else {
			set({ travelersValue: `${adults} дор. + ${childrenCount} дит.` })
		}
	},
	resetTravelers: () => {
		set({
			selectedAdult: null,
			childNumber: [],
			touristsResult: [],
			travelersValue: ''
		})
		localStorage.setItem('selectedTourists', JSON.stringify(null))
	}
}))
