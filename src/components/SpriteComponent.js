const SpriteComponent = function( imageConfig ) {
	let config = {
		key: '',
		width: null,
		height: null,
		originX: 0,
		originY: 0,
		displayWidth: 16,
		displayHeight: 16,
		scaleX: 1,
		scaleY: 1,
		depth: 0,
		... imageConfig
	};

	for ( const key in config ) {
		this[key] = config[key];
	}
}

export default SpriteComponent;