import AnimationComponent from "../components/AnimationComponent"

const HorseMoveRight = new AnimationComponent( {
	name: 'hr',
	frames: [
		{
			originX: 0,
			originY: 16,
			scaleX: 1,
			duration: 150
		},
		{
			originX: 0,
			originY: 32,
			duration: 150
		},
		{
			originX: 0,
			originY: 48,
			duration: 150
		}
	]
} );
const HorseMoveLeft = new AnimationComponent( {
	name: 'hl',
	frames: [
		{
			originX: 0,
			originY: 16,
			scaleX: -1,
			duration: 150
		},
		{
			originX: 0,
			originY: 32,
			duration: 150
		},
		{
			originX: 0,
			originY: 48,
			duration: 150
		}
	]
} );
const IdleHorse = new AnimationComponent( {
	name: 'hi',
	frames: [
		{
			originX: 24,
			originY: 16,
			duration: 500
		},
		{
			originX: 24,
			originY: 32,
			duration: 500
		}
	]
} )

export { IdleHorse, HorseMoveLeft, HorseMoveRight };