const TextComponent = function( args ) {
	const def = {
		text: '',
		textAlign: 'left',
		color: '#000000',
		font: '8px sans-serif',
		...args
	};

	for ( const [key, value] of Object.entries( def ) ) {
		this[key] = value;
	}
};

export default TextComponent;
