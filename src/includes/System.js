import EventEmitter from "./EventEmitter";

export default class System extends EventEmitter{
	constructor( scene ) {
		super();
		this.scene = scene;
	}

	init() {}

	update( delta ) {}

	destroy(){}
}