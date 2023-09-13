import { CIRCLESWEAPON, POSITION } from "../helpers/Constants";
import System from "../includes/System";

export default class CircleAroundSystem extends System {
	update( delta ) {
		this.componentManager.query( e => e.components.has( CIRCLESWEAPON ) ).forEach( entity => {
			let components = entity.components;
			let circle = components.get( CIRCLESWEAPON );
			let position = components.get( POSITION );

			let targetComponents = circle.target.components;
			let targetPosition = targetComponents.get( POSITION );

			if ( circle.accumulator > Math.PI * 2 ) {
				circle.accumulator = 0;
			} else {
				circle.accumulator += circle.rotationSpeed * delta / 1000
			}

			position.x = targetPosition.x - Math.cos( circle.accumulator ) * circle.distance;
			position.y = targetPosition.y - Math.sin( circle.accumulator ) * circle.distance;
		} );
	}
}