import EventEmitter from "./EventEmitter";

export default class System extends EventEmitter{
	constructor( scene ) {
		super();
		this.scene = scene;
		this.componentManager = null;
	}

	init() {}

	update( delta ) {}

	destroy(){}
}