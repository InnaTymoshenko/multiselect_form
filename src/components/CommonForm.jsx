import React from 'react'
import CountrySelect from './countrySelect/CountrySelect'
import AirSelect from './airSelect/AirSelect'
import DateSelect from './dateSelect/DateSelect'
import DurationSelect from './durationSelect/DurationSelect'
import TravelersSelect from './travelersSelect/TravelersSelect'

import styles from './commonForm.module.css'

const CommonForm = () => {
	const handleSubmit = async e => {
		e.preventDefault()

		const localFormData = {
			selectedCountry: JSON.parse(localStorage.getItem('selectedResort')),
			selectedAirport: JSON.parse(localStorage.getItem('selectedAirport')),
			startDate: JSON.parse(localStorage.getItem('selectedDate')),
			selectedDuration: JSON.parse(localStorage.getItem('selectedDuration')),
			selectedTourists: JSON.parse(localStorage.getItem('selectedTourists'))
		}

		if (
			!localFormData.selectedCountry.country ||
			!localFormData.selectedAirport.id ||
			!localFormData.startDate.dateFrom ||
			!localFormData.selectedDuration ||
			!localFormData.selectedTourists
		) {
			console.warn('Обязательные поля не заполнены!', localFormData)
			alert('Будь ласка, заповніть всі обов’язкові поля!')
			return
		}

		alert('Форма успішно відправлена!')
		console.log('Данные формы отправлены:', localFormData)

		// try {
		// 	const response = await fetch('', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(localFormData)
		// 	})

		// 	if (response.ok) {
		// 		alert('Форма успішно відправлена!')
		// 		resetAirports()
		// 		resetDates()
		// 		resetSelectedResorts()
		// 		resetDuration()
		// 		resetTravelers()
		// 	} else {
		// 		alert('Помилка при відправці форми. Спробуйте пізніше.')
		// 	}
		// } catch (error) {
		// 	console.error('Error submitting form:', error)
		// 	alert('Невідома помилка. Спробуйте пізніше.')
		// }
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.searchBlockWrapper}>
				<h1 className={styles.commonTitle}>Пошук туру</h1>
				<form className={styles.orderForm} onSubmit={handleSubmit}>
					<div className={styles.commonBlock}>
						<div className={styles.wrapperDiv}>
							<span>Куди</span>
							<CountrySelect />
						</div>
						<AirSelect />
						<DateSelect />
						<div className={styles.wrapperDiv}>
							<span>Тривалість</span>
							<DurationSelect />
						</div>
						<TravelersSelect />
						<button className={styles.formBtn} type="submit">
							Знайти
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CommonForm
