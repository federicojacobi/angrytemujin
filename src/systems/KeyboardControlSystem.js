import { ANIMATION, BODY, BOTTOM, KEYBOARDCONTROL, LEFT, RIGHT, TOP } from "../helpers/Constants";
import { HorseMoveLeft, HorseMoveRight, IdleHorse } from "../helpers/HorseAnimations";
import System from "../includes/System";

const keys = {
	W: false,
	A: false,
	S: false,
	D: false,
};


export default class KeyboardControlSystem extends System {
	constructor( scene ) {
		super( scene );

		window.addEventListener( 'keydown', this.keydown.bind( this ) );
		window.addEventListener( 'keyup', this.keyup.bind( this ) );
	}

	keydown( e ) {
		switch ( e.code ) {
			case "KeyS":
			case "ArrowDown":
				keys.S = true;
				break;
			  
			case "KeyW":
			case "ArrowUp":
				keys.W = true;
				break;

			case "KeyA":
			case "ArrowLeft":
				keys.A = true;
				break;

			case "KeyD":
			case "ArrowRight":
				keys.D = true;
				break;
		}
	}

	keyup( e ) {
		switch ( e.code ) {
			case "KeyS":
			case "ArrowDown":
				keys.S = false;
				break;
			  
			case "KeyW":
			case "ArrowUp":
				keys.W = false;
				break;

			case "KeyA":
			case "ArrowLeft":
				keys.A = false;
				break;

			case "KeyD":
			case "ArrowRight":
				keys.D = false;
				break;
		}
	}

	destroy() {
		window.removeEventListener( 'keydown', this.keydown );
		window.removeEventListener( 'keyup', this.keyup );
	}

	update( delta ) {
		let entities = this.ecs.query( e => e.components.has( KEYBOARDCONTROL ) && e.components.has( BODY ) )
		entities.forEach( entity => {
			let body = entity.components.get( BODY );
			let currentAnim = this.scene.player.components.get( ANIMATION );

			if ( keys.W || keys.S ) {
				if ( keys.W ) {
					body.facing = TOP;
					body.velocity.y = body.speed * -1 
				} else {
					body.facing = BOTTOM;
					body.velocity.y = body.speed
				}
			} else {
				body.velocity.y = 0;
			}

			if ( keys.A || keys.D ) {
				if ( keys.A ) {
					body.velocity.x = body.speed * -1;
					body.facing = LEFT;
					if ( entity == this.scene.player && currentAnim.name != 'hl' ) {
						Object.assign( currentAnim, HorseMoveLeft )
						currentAnim.currentFrame = 0;
						currentAnim.elapsed = 0;
					}
				} else {
					if ( entity == this.scene.player && currentAnim.name != 'hr' ) {
						Object.assign( currentAnim, HorseMoveRight );
						currentAnim.currentFrame = 0;
						currentAnim.elapsed = 0;
					}
					body.facing = RIGHT;
					body.velocity.x = body.speed
				}
			} else {
				body.velocity.x = 0;
			}

			if ( entity == this.scene.player && body.velocity.x == 0 && body.velocity.y == 0 ) {
				if ( currentAnim.name !== 'hi' ) {
					Object.assign( currentAnim, IdleHorse );
					currentAnim.currentFrame = 0;
					currentAnim.elapsed = 0;
				}
			}
		} );
	}
}