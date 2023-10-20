import { TWEEN } from "../helpers/Constants";
import System from "../includes/System";

export default class TweenSystem extends System {
	constructor( scene ) {
		super( scene );
		
		this.query = e => e.components.has( TWEEN );
	}

	lerp( start_value, end_value, pct ) {
		return ( start_value + (end_value - start_value) * pct );
	}

	update( delta ) {
		let entities = this.ecs.query( this.query );

		// Check friends being hit by enemies.
		entities.forEach( entity => {
			const tween = entity.components.get( TWEEN );
			tween.elapsed += delta;
			tween.pct = tween.elapsed / tween.duration;
			if ( tween.pct >= 1 ) {
				tween.callback && tween.callback();
				this.ecs.removeComponent( entity, TWEEN );
			} else {
				tween.target[tween.property] = this.lerp( tween.startValue, tween.endValue, tween.easingFunction( tween.pct ) );
			}
		} );
	}
}