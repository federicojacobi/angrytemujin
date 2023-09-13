import { BODY, POSITION } from "../helpers/Constants";
import System from "../includes/System";

export default class PhysicsSystem extends System {
	update( delta ) {
		let entities = this.componentManager.query( e => e.components.has( BODY ) && e.components.has( POSITION ) );
		entities.forEach( entity => {
			let component = entity.components;
			let position = component.get( POSITION );
			let body = component.get( BODY );

			position.x += ( body.velocity.x * delta ) / 1000;
			position.y += ( body.velocity.y * delta ) / 1000;
			body.angle += body.angularVelocity * delta / 1000;

			if ( position.x < 0 ) {
				position.x = 0;
			}

			if ( position.x > 10000 ) {
				position.x = 10000;
			}

			if ( position.y < 0 ) {
				position.y = 0;
			}

			if ( position.y > 6000 ) {
				position.y = 6000;
			}
		} );
	}
}