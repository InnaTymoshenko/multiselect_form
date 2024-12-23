import { useState } from 'react'

export const useMouseEvents = () => {
	const [hoveredItem, setHoveredItem] = useState(null)

	const handleMouseEnter = id => {
		setHoveredItem(id)
	}

	const handleMouseLeave = () => {
		setHoveredItem(null)
	}

	return {
		hoveredItem,
		handleMouseEnter,
		handleMouseLeave
	}
}
