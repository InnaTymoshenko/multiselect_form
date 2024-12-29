import React from 'react'
import { BiSolidDownArrow } from 'react-icons/bi'
import SearchPlace from './countrySelect/SearchPlace'
import AirSelect from './airSelect/AirSelect'
import DateSelect from './dateSelect/DateSelect'
import { useDateStore, useResortsStore, useAirportSelectStore } from '../store/store'

import styles from './commonForm.module.css'

const CommonForm = () => {
	const { resetDates } = useDateStore()
	const { resetAirports } = useAirportSelectStore()
	const { resetSelectedResorts } = useResortsStore()

	const handleSubmit = async e => {
		e.preventDefault()

		const localFormData = {
			selectedCountry: JSON.parse(localStorage.getItem('selectedResort')),
			selectedAirport: JSON.parse(localStorage.getItem('selectedAirport')),
			startDate: JSON.parse(localStorage.getItem('selectedDate'))
		}

		if (
			!localFormData.selectedCountry.country ||
			!localFormData.selectedAirport.id ||
			!localFormData.startDate.dateFrom
		) {
			console.log('Обязательные поля не заполнены!', localFormData)
			alert('Будь ласка, заповніть всі обов’язкові поля!')
			return
		}

		alert('Форма успішно відправлена!')
		resetAirports()
		resetDates()
		resetSelectedResorts()
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
				<h1
					style={{
						marginBlockEnd: '3rem'
					}}
				>
					Пошук туру
				</h1>

				<form className={styles.orderForm} onSubmit={handleSubmit}>
					<div className={styles.commonBlock}>
						<div className={styles.wrapperDiv}>
							<span>Куди</span>
							<SearchPlace />
						</div>
						<AirSelect />
						<DateSelect />
						<div className={styles.wrapperDiv}>
							<span>Тривалість</span>
							<div className={styles.formField} tabIndex="-1">
								<input
									className={styles.searchAir}
									type="search"
									placeholder={'example'}
									value={''}
									onChange={() => {}}
									onClick={() => {}}
								/>
								<BiSolidDownArrow className={styles.formIcon} />
							</div>
						</div>
						<div className={styles.wrapperDiv}>
							<div className={styles.formField} tabIndex="-1">
								<input
									className={styles.searchAirEx}
									type="search"
									placeholder={'example'}
									value={''}
									onChange={() => {}}
									onClick={() => {}}
								/>
								<BiSolidDownArrow className={styles.formIcon} />
							</div>
						</div>
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
