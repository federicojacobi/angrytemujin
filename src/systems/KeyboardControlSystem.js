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

		this.query = e => e.components.has( KEYBOARDCONTROL ) && e.components.has( BODY );

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
		let entities = this.ecs.query( this.query )
		entities.forEach( entity => {
			let body = entity.components.get( BODY );
			let currentAnim = this.scene.player.components.get( ANIMATION );

			if ( keys.W || keys.S ) {
				if ( keys.W ) {
					body.facing = TOP;
					body.vy = body.speed * -1 
				} else {
					body.facing = BOTTOM;
					body.vy = body.speed
				}
			} else {
				body.vy = 0;
			}

			if ( keys.A || keys.D ) {
				if ( keys.A ) {
					body.vx = body.speed * -1;
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
					body.vx = body.speed
				}
			} else {
				body.vx = 0;
			}

			if ( entity == this.scene.player && body.vx == 0 && body.vy == 0 ) {
				if ( currentAnim.name !== 'hi' ) {
					Object.assign( currentAnim, IdleHorse );
					currentAnim.currentFrame = 0;
					currentAnim.elapsed = 0;
				}
			}
		} );
	}
}