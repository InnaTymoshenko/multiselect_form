import React, { useState } from 'react'
import { BiSolidDownArrow, BiSolidUpArrow } from 'react-icons/bi'
import { useMouseEvents } from '../../method/useMouseEvents'

import styles from './travelersSelect.module.css'

const TravelersForm = ({ openChildrenForm, isChildren }) => {
	const touristNumber = Array.from({ length: 6 }, (_, i) => i + 1)
	const childrenAge = Array.from({ length: 16 }, (_, i) => i + 1)

	const [selectedAdult, setSelectedAdult] = useState(1)
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

	return (
		<>
			<div className={styles.adultBlock}>
				<p className={styles.travelsTitle}>Кількість дорослих:</p>
				<div className={styles.adultsNumbers}>
					{touristNumber.map(t => (
						<div
							key={`adult-${t}`}
							style={{
								backgroundColor:
									selectedAdult === t
										? '#4c9ce0'
										: hoveredAdult === t
										? '#F5F5F5'
										: selectedAdult === null && t === 1
										? '#4c9ce0'
										: '',
								color: selectedAdult === t ? 'white' : 'rgb(124, 144, 160)'
							}}
							className={styles.adultItem}
							onMouseEnter={() => handleMouseEnterAdult(t)}
							onMouseLeave={handleMouseLeaveAdult}
							onClick={() => setSelectedAdult(t)}
						>
							{t}
						</div>
					))}
				</div>
			</div>
			<div className={styles.childrenBlock}>
				<p className={styles.travelsTitle}>Діти:</p>
				<div className={styles.childenCheck} onClick={e => openChildrenForm(e)}>
					Додати дитину
					{isChildren ? (
						<BiSolidUpArrow className={styles.formIcon} />
					) : (
						<BiSolidDownArrow className={styles.formIcon} />
					)}
				</div>
				{isChildren && (
					<div className={styles.childrenNumbers}>
						{childrenAge.map(child => (
							<div
								key={`${child}-childAge`}
								style={{
									backgroundColor: hoveredChild === child ? '#4c9ce0' : '',
									color: hoveredChild === child ? 'white' : 'rgb(124, 144, 160)'
								}}
								className={styles.childItem}
								onMouseEnter={() => handleMouseEnterChild(child)}
								onMouseLeave={handleMouseLeaveChild}
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
