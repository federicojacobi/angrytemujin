import { BODY, DUMB_AI, PLAYER, POSITION } from "../helpers/Constants";
import { normalizeVector } from "../includes/MathHelpers";
import System from "../includes/System";

export default class AISystem extends System {
	update( delta ) {
		this.componentManager.query( e => e.components.has( DUMB_AI ) ).forEach( entity => {
			let position = entity.components.get( POSITION );
			let body = entity.components.get( BODY );

			let target = entity.components.get( DUMB_AI ).focus;
			let targetPosition = target.components.get( POSITION );

			const vx = targetPosition.x - position.x;
			const vy = targetPosition.y - position.y;

			let normal = normalizeVector( vx, vy );
			let direction = 1;
			if ( target.components.get( PLAYER ).status === 0 ) {
				direction = -1;
			}

			body.velocity.x = direction * 30 * normal.x;
			body.velocity.y = direction * 30 * normal.y;
		} );
	}
}