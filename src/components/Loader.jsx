const Loader = () => (
	<div
		className="spinner"
		style={{
			width: '50px',
			height: '50px',
			border: '5px solid #ccc',
			borderTop: '5px solid #333',
			borderRadius: '50%',
			animation: 'spin 1s linear infinite'
		}}
	></div>
)

export default Loader
