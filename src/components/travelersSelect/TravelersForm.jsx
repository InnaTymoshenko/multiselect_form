import React, { useEffect, useState } from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'
import { MdOutlineClose } from 'react-icons/md'
import { useMouseEvents } from '../../method/useMouseEvents'
import { useTravelersStore } from '../../store/store'

import styles from './travelersSelect.module.css'

const TravelersForm = ({
	openChildrenForm,
	isChildren,
	showModal,
	setShowModal,
	handleSelectedAdult,
	handleSelectChild,
	handleRemoveChild
}) => {
	const touristNumber = Array.from({ length: 6 }, (_, i) => i + 1)
	const childrenAge = Array.from({ length: 16 }, (_, i) => i + 1)

	const {
		hoveredItem: hoveredAdult,
		handleMouseEnter: handleMouseEnterAdult,
		handleMouseLeave: handleMouseLeaveAdult
	} = useMouseEvents()
	const {
		hoveredItem: hoveredChild,
		handleMouseEnter: handleMouseEnterChild,
		handleMouseLeave: handleMouseLeaveChild
	} = useMouseEvents()

	const [isDisabled, setIsDisabled] = useState(false)
	const [notAllowed, setNotAllowed] = useState(false)
	const { selectedAdult, childNumber, touristsResult } = useTravelersStore()

	useEffect(() => {
		setIsDisabled(
			!localStorage.getItem('selectedResort') || !JSON.parse(localStorage.getItem('selectedResort')).country
		)
	}, [])

	useEffect(() => {
		const adults = parseInt(touristsResult[0] || 2, 10)
		const children = touristsResult.length - 1
		const totalTourists = adults + children

		setNotAllowed(totalTourists >= 6)
	}, [touristsResult])

	return (
		<>
			<div className={styles.adultBlock}>
				<p className={styles.travelsTitle}>Кількість дорослих:</p>
				{showModal && (
					<div className={styles.blockError}>
						<p>Ви не можете обрати більше 6 людей</p>
					</div>
				)}
				<div className={styles.adultsNumbers}>
					{touristNumber.map(t => {
						const childrenCount = touristsResult.length - 1
						const maxAdults = 6 - childrenCount
						const isDisabledForAdults = t > maxAdults
						return (
							<div
								key={`adult-${t}`}
								style={{
									backgroundColor:
										selectedAdult === t
											? '#4c9ce0'
											: hoveredAdult === t
											? '#F5F5F5'
											: selectedAdult === null && t === 2
											? '#4c9ce0'
											: '',
									color: selectedAdult === t || (selectedAdult === null && t === 2) ? 'white' : 'rgb(124, 144, 160)',
									cursor: isDisabled || isDisabledForAdults ? 'none' : 'pointer'
								}}
								className={styles.adultItem}
								onMouseEnter={() => !isDisabledForAdults && handleMouseEnterAdult(t)}
								onMouseLeave={handleMouseLeaveAdult}
								onClick={() => {
									if (!isDisabledForAdults) {
										setShowModal(false)
										handleSelectedAdult(t)
									} else {
										setShowModal(true)
									}
								}}
							>
								{t}
							</div>
						)
					})}
				</div>
			</div>
			<div className={styles.childrenBlock}>
				<p className={styles.travelsTitle}>Діти:</p>
				{childNumber.length > 0 && (
					<div className={styles.selectedChildBlock}>
						{childNumber.map((c, i) => (
							<div key={`${c}-selectedChild-${i}`} className={styles.childSelectedItem}>
								<div className={styles.childItem}>
									<span className={styles.childSpan}>{c}</span>
									{c === 1 ? ' рік' : c >= 2 && c <= 4 ? ' роки' : ' років'}
								</div>
								<MdOutlineClose className={styles.iconClose} onClick={e => handleRemoveChild(e, c)} />
							</div>
						))}
					</div>
				)}

				<div
					style={{
						cursor: notAllowed ? 'none' : 'pointer'
					}}
					className={styles.childenCheck}
					onClick={!notAllowed ? e => openChildrenForm(e) : null}
				>
					Додати дитину
					{isChildren && !notAllowed ? (
						<BiSolidUpArrow className={styles.formIcon} />
					) : (
						<BiSolidDownArrow
							style={{
								color: notAllowed ? '#cbcbcb' : '#4c9ce0'
							}}
							className={styles.formIconAllowed}
						/>
					)}
				</div>
				{isChildren && (
					<div className={styles.childrenNumbers}>
						{childrenAge.map(child => (
							<div
								key={`${child}-childAge`}
								style={{
									backgroundColor: hoveredChild === child ? '#4c9ce0' : '',
									color: hoveredChild === child ? 'white' : 'rgb(124, 144, 160)',
									cursor: isDisabled ? 'none' : 'pointer'
								}}
								className={styles.childItem}
								onMouseEnter={() => handleMouseEnterChild(child)}
								onMouseLeave={handleMouseLeaveChild}
								onClick={!isDisabled ? e => handleSelectChild(e, child) : null}
							>
								<span className={styles.childSpan}>{child}</span>
								{child === 1 ? ' рік' : child >= 2 && child <= 4 ? ' роки' : ' років'}
							</div>
						))}
					</div>
				)}
			</div>
		</>
	)
}

export default TravelersForm
