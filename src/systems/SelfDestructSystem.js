import { SELFDESTRUCT } from "../helpers/Constants";
import System from "../includes/System";

export default class SelfDestructSystem extends System {
	constructor( scene ) {
		super( scene );
	}

	update( delta ) {
		this.componentManager.query( e => e.components.has( SELFDESTRUCT ) )
		.forEach( entity => {
			let sd = entity.components.get( SELFDESTRUCT );
			sd.current += delta;
			if ( sd.current >= sd.ttl ) {
				this.entityManager.kill( entity );
			}
		} );
	}
}