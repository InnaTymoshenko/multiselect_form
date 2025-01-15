import { create } from 'zustand'
import { formatToStoreDate, getNightsText } from '../method/fn'
import { dataTourDuration } from '../data/duration'

export const useResortsStore = create((set, get) => ({
	countries: [],
	cities: [],
	isLoadingCountries: false,
	isLoadingCities: false,
	errorCountries: null,
	errorCities: null,
	selectedCountry: null,
	filteredCities: [],
	selectedCities: [],
	searchValue: '',
	selectAll: true,
	searchResults: { countries: [], cities: [] },
	countryResult: { country: '', cities: [] },
	placeholder: 'Країна, курорт, готель',
	hasChanges: false,

	fetchCountries: async API => {
		set({ isLoadingCountries: true, errorCountries: null })

		fetch(API)
			.then(response => {
				if (!response.ok) {
					throw new Error('Помилка завантаження країн')
				}
				return response.json()
			})
			.then(data => {
				set({ countries: data.countryList })
			})
			.catch(error => {
				set({ errorCountries: error.message })
			})
			.finally(() => {
				set({ isLoadingCountries: false })
			})
	},
	fetchCities: async API => {
		set({ cities: [], isLoadingCities: true, errorCities: null })

		fetch(API)
			.then(response => {
				if (!response.ok) {
					throw new Error('Помилка завантаження міст')
				}
				return response.json()
			})
			.then(data => {
				set({ cities: data.cityLists })
			})
			.catch(error => {
				console.error('Помилка завантаження міст:', error)
				set({ errorCities: error.message })
			})
			.finally(() => {
				set({ isLoadingCities: false })
			})
	},
	setSearchValue: searchValue => set({ searchValue }),
	setPlaceholder: placeholder => set({ placeholder }),
	setSelectedCities: selectedCities => set({ selectedCities }),
	setSelectedCountry: selectedCountry => set({ selectedCountry }),
	countrySelection: id => {
		set({
			selectedCountry: id,
			selectAll: true,
			hasChanges: true
		})
	},
	resortSearchValue: value => {
		const { countries, cities } = get()

		const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(value))

		const filteredCities = cities
			.filter(city => city.name.toLowerCase().includes(value))
			.map(city => ({
				...city,
				countryName: countries.find(country => country.id === city.country)?.name || ''
			}))

		set({
			searchValue: value,
			searchResults: {
				countries: filteredCountries,
				cities: filteredCities
			}
		})
	},
	updatePlaceholder: () => {
		const { selectedCountry, countries, filteredCities } = get()

		const selectedCountryName = countries.find(country => country.id === selectedCountry)?.name || ''
		const cityCount = filteredCities.length

		set({
			placeholder: `${selectedCountryName}: ${cityCount} ${cityCount === 1 ? 'курорт' : 'курортів'}`
		})
	},
	updateCountryResult: (countryId, cityIds) => {
		const result = {
			country: countryId,
			cities: cityIds
		}
		set({
			countryResult: result,
			selectedCountry: countryId,
			hasChanges: true
		})
		sessionStorage.setItem('selectedResort', JSON.stringify(result))
	},
	updateSelection: updatedCities => {
		const { selectedCountry, countries, filteredCities } = get()

		const countryName = countries.find(country => country.id === selectedCountry)?.name || ''
		if (updatedCities.length === filteredCities.length) {
			set({
				placeholder: `${countryName}: ${filteredCities.length} курортів`,
				selectAll: true
			})
		} else if (updatedCities.length === 0) {
			set({
				placeholder: `${countryName}`,
				selectAll: false
			})
		} else {
			set({
				placeholder: `${countryName}: ${updatedCities.length} ${updatedCities.length === 1 ? 'курорт' : 'курорти'}`,
				selectAll: false
			})
		}

		set({
			selectedCities: updatedCities,
			countryResult: {
				country: selectedCountry ? `${selectedCountry}` : '',
				cities: updatedCities.length ? updatedCities : ['undefined']
			},
			hasChanges: true
		})
	},
	updateFilteredCities: () => {
		const { cities, selectedCountry } = get()

		const countryCities = cities.filter(city => city.country === selectedCountry)
		const allCityIds = countryCities.map(city => city.id)

		set({
			filteredCities: countryCities,
			selectedCities: allCityIds,
			selectAll: true
		})
	},
	saveResortsResult: () => {
		const { selectedCountry, countries, selectedCities } = get()
		const result = {
			country: selectedCountry ? countries.find(country => country.id === selectedCountry)?.id : '',
			cities: selectedCities.length ? selectedCities : ['undefined']
		}
		set({
			countryResult: result,
			selectedCountry: selectedCountry
		})
		sessionStorage.setItem('selectedResort', JSON.stringify(result))
	},
	saveCountryResult: () => {
		const { hasChanges, selectedCountry, countries, selectedCities } = get()
		const result = {
			country: selectedCountry ? countries.find(country => country.id === selectedCountry)?.id : '',
			cities: selectedCities.length ? selectedCities : ['undefined']
		}
		const storedResult = JSON.parse(sessionStorage.getItem('selectedResort'))
		const selectedCountryName = countries.find(country => country.id === storedResult.country)?.name || ''
		const cityCount = storedResult.cities.length
		if (hasChanges) {
			set({
				countryResult: result,
				selectedCountry: selectedCountry
			})
			sessionStorage.setItem('selectedResort', JSON.stringify(result))
		} else {
			if (storedResult.country) {
				set({
					countryResult: {
						country: storedResult.country,
						cities: storedResult.cities
					},
					placeholder: `${selectedCountryName}: ${cityCount} ${cityCount === 1 ? 'курорт' : 'курортів'}`
				})
			} else {
				set({
					countryResult: { country: '', cities: [] },
					placeholder: 'Країна, курорт, готель'
				})
				sessionStorage.setItem('selectedResort', JSON.stringify({ country: '', cities: [] }))
			}
		}
	},
	resetCountryResults: () => {
		set({
			selectedCountry: null,
			filteredCities: [],
			selectedCities: [],
			selectAll: true,
			countryResult: { country: '', cities: [] },
			placeholder: 'Країна, курорт, готель',
			hasChanges: false
		})
		sessionStorage.setItem('selectedResort', JSON.stringify({ country: '', cities: [] }))
	}
}))

export const useAirportSelectStore = create((set, get) => ({
	airports: [],
	uniqueAirports: null,
	isLoading: false,
	error: null,
	airValue: '',
	airResult: { id: '', name: '', code: '', country: '' },
	placeholder: '',
	selectedAir: null,
	fetchAirports: async API => {
		set({ isLoading: true, error: null })

		fetch(API)
			.then(response => {
				if (!response.ok) {
					throw new Error('Помилка завантаження аеропортів')
				}
				return response.json()
			})
			.then(data => {
				set({ airports: data.airports })
			})
			.catch(error => {
				set({ error: error.message })
			})
			.finally(() => {
				set({ isLoading: false })
			})
	},
	setSelectedAir: selectedAir => set({ selectedAir }),
	setPlaceholder: placeholder => set({ placeholder }),
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
		const storedResort = JSON.parse(sessionStorage.getItem('selectedResort'))
		const storedAir = JSON.parse(sessionStorage.getItem('selectedAirport'))
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

			sessionStorage.setItem('selectedAirport', JSON.stringify(tempSelectedAir))
		}
	},
	resetAirports: () => {
		set({
			airValue: '',
			airResult: { id: '', name: '', code: '', country: '' },
			placeholder: `з Кишинева`
		})
		sessionStorage.setItem('selectedAirport', JSON.stringify({ id: '', name: '', code: '', country: '' }))
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
		sessionStorage.setItem(
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
		sessionStorage.setItem('selectedDate', JSON.stringify({ dateFrom: '', dateTo: '' }))
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
		sessionStorage.setItem('selectedDuration', JSON.stringify(tempDuration))
	},
	resetDuration: () => {
		set({
			durationValue: '',
			tourDurationResult: null,
			selectDuration: null
		})
		sessionStorage.setItem('selectedDuration', JSON.stringify(null))
	}
}))

export const useTravelersStore = create((set, get) => ({
	selectedAdult: null,
	childNumber: [],
	touristsResult: [],
	travelersValue: '',
	setTouristsResult: () => {
		const formattedResult = get().touristsResult.join('')
		sessionStorage.setItem('selectedTourists', JSON.stringify(formattedResult))
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
		sessionStorage.setItem('selectedTourists', JSON.stringify(null))
	}
}))
