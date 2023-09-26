import { ANIMATION, SPRITE } from "../helpers/Constants";
import System from "../includes/System";

export default class AnimationSystem extends System {
	constructor( scene, config ) {
		super( scene );
	}

	update( delta ) {
		this.ecs.query( e => e.components.has( ANIMATION ) ).forEach( entity => {
			let state = entity.components.get( ANIMATION );
			let sprite = entity.components.get( SPRITE );

			if ( state.elapsed >= state.frames[ state.currentFrame ].duration ) {
				state.elapsed = 0;
				state.currentFrame++;
				if ( state.currentFrame === state.frames.length ) {
					if ( state.loop ) {
						state.currentFrame = 0;
					} else {
						entity.components.delete( ANIMATION );
						return;
					}
				}
			} else {
				state.elapsed += delta;
				
			}
			// reassign sprite config
			let frame = state.frames[ state.currentFrame ];
			Object.keys( sprite ).forEach( key => {
				if ( frame.hasOwnProperty( key ) ) {
					sprite[ key ] = frame[ key ];
				}
			} );
		} );
	}
}