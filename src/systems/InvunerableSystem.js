import { INVULNERABLE } from "../helpers/Constants";
import System from "../includes/System";

export default class InvulnerableSystem extends System {
	constructor( scene ) {
		super( scene );
		this.query = e => e.components.has( INVULNERABLE );
	}

	update( delta ) {
		this.ecs.query( this.query ).forEach( entity => {
			const timer = entity.components.get( INVULNERABLE );
			if ( timer.accumulator < timer.duration ) {
				timer.accumulator += delta;
			} else {
				this.ecs.removeComponent( entity, INVULNERABLE );
			}
		} );
	}
}