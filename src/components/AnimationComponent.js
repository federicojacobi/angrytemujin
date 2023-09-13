// Sequence of sprite configs

const AnimationComponent = function( args ) {
	let config = {
		name: '',
		currentFrame: 0,
		elapsed: 0,
		loop: true,
		frames: [], // Sprite configs + duration in ms
		... args
	};

	for ( const key in config ) {
		this[key] = config[key];
	}
}

export default AnimationComponent;