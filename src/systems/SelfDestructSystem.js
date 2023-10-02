import { SELFDESTRUCT } from "../helpers/Constants";
import System from "../includes/System";

export default class SelfDestructSystem extends System {
	constructor( scene ) {
		super( scene );
		this.query = e => e.components.has( SELFDESTRUCT );
	}

	update( delta ) {
		this.ecs.query( this.query )
		.forEach( entity => {
			let sd = entity.components.get( SELFDESTRUCT );
			sd.current += delta;
			if ( sd.current >= sd.ttl ) {
				this.ecs.killEntity( entity );
			}
		} );
	}
}