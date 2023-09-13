import InvulnerableComponent from "../components/InvulnerableComponent";
import { INVULNERABLE } from "../helpers/Constants";
import System from "../includes/System";

export default class InvulnerableSystem extends System {

	update( delta ) {
		this.componentManager.query( e => e.components.has( INVULNERABLE ) ).forEach( entity => {
			let components = entity.components;
			const timer = components.get( INVULNERABLE );
			if ( timer.accumulator < timer.max ) {
				timer.accumulator += delta;
			} else {
				entity.components.delete( INVULNERABLE );
			}
		} );
	}
}