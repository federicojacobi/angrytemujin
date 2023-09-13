import { RIGHT } from "../helpers/Constants";

const BodyComponent = function( args ) {
	const def = {
		width: 16,
		height: 16,
		speed: 0,
		facing: RIGHT,
		velocity: {
			x: 0,
			y: 0
		},
		...args
	};

	for ( const [key, value] of Object.entries( def ) ) {
		this[key] = value;
	}
};

export default BodyComponent;
