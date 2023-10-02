import { BODY, POSITION } from "../helpers/Constants";
import System from "../includes/System";

export default class PhysicsSystem extends System {
	constructor( scene ) {
		super( scene );
		this.query = e => e.components.has( BODY ) && e.components.has( POSITION );
	}
	update( delta ) {
		let entities = this.ecs.query( this.query );
		entities.forEach( entity => {
			let position = entity.components.get( POSITION );
			let body = entity.components.get( BODY );

			position.x += ( body.vx * delta ) / 1000;
			position.y += ( body.vy * delta ) / 1000;
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