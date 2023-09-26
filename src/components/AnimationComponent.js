// Sequence of sprite configs

import { ANIMATION } from "../helpers/Constants";

export default AnimationComponent = {
	type: ANIMATION,
	name: '',
	currentFrame: 0,
	elapsed: 0,
	loop: true,
	frames: [], // Sprite configs + duration in ms
};