import { TWEEN } from "../helpers/Constants";
const easeInEaseOut = ( x ) => -(Math.cos(Math.PI * x) - 1) / 2;

export default TweenComponent = {
	type: TWEEN,
	duration: 1000,
	elapsed: 0,
	pct: 0,
	target: null, //object
	property: '',
	startValue: 0,
	endValue: 1,
	callback: null,
	easingFunction: easeInEaseOut
};
