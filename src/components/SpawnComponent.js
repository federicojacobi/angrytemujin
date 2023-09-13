const SpawnComponent = function( args ) {
	let config = {
		currentTime: 0,
		trigger: 600,
		... args
	};

	for ( const key in config ) {
		this[key] = config[key];
	}
}

export default SpawnComponent;