import { CAMERA, HEALTH, PLAYER, POSITION, SPRITE, TEXT } from "../helpers/Constants";
import System from "../includes/System";

export default class DrawSystem extends System {
	constructor( scene, config ) {
		super( scene );

		this.config = {
			...config
		};
	}

	init() {

		this.canvas = document.createElement( 'canvas' );
		this.canvas.style.backgroundColor = 'black';
		this.canvas.style.imageRendering = 'pixelated';
		this.canvas.style.margin = '0 auto';
		this.canvas.style.display = 'block';
		this.ctx = this.canvas.getContext( '2d' );
		this.canvas.width = 640;
		this.canvas.height = 480;
		document.body.appendChild( this.canvas );
	}

	update() {
		let ctx = this.ctx;
		ctx.globalCompositeOperation = 'normal';
		// ctx.fillStyle = '#A7ACA7';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#FFFFFF';
		let drawCalls = 0;

		if ( ! this.camera ) {
			this.camera = this.componentManager.query( e => e.components.has( CAMERA ) )[0];
		}

		let camPosition = this.camera.components.get( POSITION );
		let camEdgeLeft = camPosition.x - ( this.canvas.width / 2 ) - 40; // 40 is arbitrary so sprite dont get cut off.
		let camEdgeRight = camPosition.x + ( this.canvas.width / 2 ) + 40;
		let camEdgeTop = camPosition.y - ( this.canvas.height / 2 ) - 40;
		let camEdgeBottom = camPosition.y + ( this.canvas.height / 2 ) + 40;

		let entities = this.componentManager.query( e => e.components.has( SPRITE ) );
		
		// ctx.globalCompositeOperation = 'multiply';
		// Culling
		entities.filter( entity => {
			

			let position = entity.components.get( POSITION );
			if ( 
				position.x < camEdgeLeft || 
				position.x > camEdgeRight ||
				position.y > camEdgeBottom || 
				position.y < camEdgeTop 
			) {
				return false;
			}
			return true;
		} )
		// sort by depth
		.sort( ( a, b ) => a.components.get( SPRITE ).depth - b.components.get( SPRITE ).depth )
		.forEach( entity => {
			let component = entity.components;

			let position = component.get( POSITION );
			let sprite = component.get( SPRITE );

			// Prevent subpixel rendering
			let x;
			if ( sprite.scaleX < 0 ) {
				x = Math.round( position.x + sprite.displayWidth - camPosition.x + ( this.canvas.width / 2 ) )
			} else {
				x = Math.round( position.x - camPosition.x + ( this.canvas.width / 2 ) )
			}

			ctx.setTransform( 
				sprite.scaleX, 
				0, 
				0, 
				sprite.scaleY, 
				x, 
				Math.round( position.y - camPosition.y + ( this.canvas.height / 2 ) )
			); // sets scale and origin

			// Allow subpixel rendering
			// ctx.setTransform( sprite.scale, 0, 0, sprite.scale, position.x - camPosition.x + ( this.canvas.width / 2 ), position.y - camPosition.y + ( this.canvas.height / 2 ) ); // sets scale and origin

			// ctx.rotate( body.angle );
			
			// if ( component.has( 'DebugTextComponent' ) ) {
			// 	ctx.strokeRect( -body.width * body.originX, -body.height * body.originY, body.width, body.height );
			// }
			
			let image = this.scene.game.resourceManager.get( sprite.key );
			ctx.drawImage(
				image, 
				sprite.originX,
				sprite.originY,
				sprite.width,
				sprite.height,
				-sprite.width * position.originX,
				-sprite.height * position.originY,
				sprite.displayWidth,
				sprite.displayHeight
				);
			ctx.setTransform( 1, 0, 0, 1, 0, 0 );
			
			ctx.setTransform( 1, 0, 0, 1, Math.round( position.x - camPosition.x + ( this.canvas.width / 2 ) ), Math.round( position.y - camPosition.y + ( this.canvas.height / 2 ) ) ); // sets scale and origin
			let hp = component.get( HEALTH );
			if ( hp ) {
				if ( entity == this.scene.player ) {
					ctx.strokeStyle = '#000000';
					ctx.lineWidth = 1;
					ctx.fillStyle = '#FF0000';
					ctx.fillRect( -25, 20, Math.round( hp.current * 80 / hp.max ), 5 );
					ctx.strokeRect( -25, 20, 80, 5 );
				}
				// ctx.fillText( `${hp.current}/${hp.max}`, 0, 25 );
			}

			ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		} );

		let textEntities = this.componentManager.query( e => e.components.has( TEXT ) && e.components.has( POSITION ) );
		textEntities.forEach( entity => {
			let position = entity.components.get( POSITION );
			let text = entity.components.get( TEXT );

			// Prevent subpixel rendering
			ctx.setTransform( 1, 0, 0, 1, Math.round( position.x - camPosition.x + ( this.canvas.width / 2 ) ), Math.round( position.y - camPosition.y + ( this.canvas.height / 2 ) ) ); // sets scale and origin

			ctx.font = text.font;
			ctx.textAlign = text.textAlign;
			ctx.fillStyle = text.color;
			ctx.fillText( text.text, 0, 0 );
			ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		} );

		// LOCATION NAME
		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.fillRect( 0, 0, this.canvas.width, 40 );
		let playerPos = this.scene.player.components.get(POSITION);
		let region;
		if ( playerPos.x < 4000 ) {
			region = 'DUNHUANG';
		} else if ( playerPos.x > 4000 && playerPos.x < 7000 ) {
			region = 'DELUN BOLDOG';
		} else {
			region = 'BEIJING';
		}
		ctx.fillStyle = '#000000';
		ctx.font = '14px sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText( region, this.canvas.width / 2, 20 );

		// Location
		ctx.textAlign = 'left';
		ctx.fillText( `${Math.round( playerPos.x / 10 )}x${Math.round( playerPos.y / 10 ) }`, this.canvas.width - 60, 20 );

		ctx.font = '10px sans-serif';
		ctx.fillStyle = '#FF0000';
		ctx.fillText( 'FPS: ' + this.scene.game.fps, this.canvas.width -40, 50 );

		ctx.fillText( `Sprites Drawn/Total: ${drawCalls} / ${entities.length}`, 10, 50 );
		if ( this.scene.player.components.has( PLAYER ) ) {
			ctx.fillStyle = '#000000';
			ctx.font = '14px sans-serif';
			ctx.textAlign = 'left';
			ctx.fillText( `LEVEL ${this.scene.player.components.get( PLAYER ).level } XP: ${this.scene.player.components.get( PLAYER ).exp }/${this.scene.player.components.get( PLAYER ).nextLevel }`, 10, 20 );
		}
	}
}