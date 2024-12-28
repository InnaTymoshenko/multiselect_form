import { create } from 'zustand'
import { formatToStoreDate } from '../method/fn'

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
		const {
			cities,
			countries,
			setPlaceholder,
			setSearchValue,
			setSelectedCountry,
			selectedCountry,
			selectedCities,
			setSelectedCities,
			setResult
		} = get()
		let tempResult
		let placeholderText
		const effectiveCountry = selectedCountry || 1
		const selectedCountryName = countries.find(country => country.id === effectiveCountry)?.name

		if (selectedCountry === null || selectedCountry === '') {
			const tempSelectedCities = cities.filter(city => city.country === 1).map(city => city.id)
			if (tempSelectedCities.length > selectedCities.length) {
				if (!selectedCities.length) {
					tempResult = {
						country: 1,
						cities: ['undefined']
					}
					placeholderText = `${selectedCountryName}`
				} else {
					tempResult = {
						country: 1,
						cities: selectedCities
					}

					placeholderText = `${selectedCountryName}: ${selectedCities.length} ${
						selectedCities.length === 1 ? 'курорт' : 'курорта'
					}`
				}
				setSelectedCountry(tempResult.country)
				setSelectedCities(tempResult.cities)
			} else {
				tempResult = {
					country: '',
					cities: []
				}
				setSelectedCountry(null)
				setSelectedCities(tempResult.cities)
				placeholderText = 'Країна, курорт, готель'
			}
		} else {
			if (!selectedCities.length) {
				tempResult = {
					country: effectiveCountry,
					cities: ['undefined']
				}

				placeholderText = `${selectedCountryName}`
			} else {
				tempResult = {
					country: effectiveCountry,
					cities: selectedCities
				}
				placeholderText = `${selectedCountryName}: ${selectedCities.length} ${
					selectedCities.length === 1 ? 'курорт' : 'курорта'
				}`
			}

			setSelectedCountry(tempResult.country)
			setSelectedCities(tempResult.cities)
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
		const { airports, uniqueAirports } = get()
		const storedResort = JSON.parse(localStorage.getItem('selectedResort'))

		if (uniqueAirports !== null) {
			if (storedResort && storedResort.country) {
				const filteredAirports = airports.filter(air => air?.country === storedResort.country)

				if (filteredAirports.length === 0) {
					return uniqueAirports.sort((a, b) => a.name.localeCompare(b.name))
				}

				return filteredAirports.sort((a, b) => a.name.localeCompare(b.name))
			}

			return uniqueAirports.sort((a, b) => a.name.localeCompare(b.name))
		}
	},
	searchAirports: value => {
		const filteredAirports = get().filterAirportsByCountry()
		return filteredAirports.filter(air => air.name.toLowerCase().includes(value.toLowerCase()))
	},
	chooseAirport: value => {
		const airports = get().airports
		const selectedAir = airports.find(air => air.name === value)
		if (selectedAir) {
			set({
				airValue: '',
				airResult: selectedAir,
				placeholder: `з ${value}`
			})
			localStorage.setItem('selectedAirport', JSON.stringify(selectedAir))
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
