import System from "../includes/System";
import TinyCanvas from "../includes/tinyCanvas/canvas";
import {CreateTexture} from "../includes/tinyCanvas/utils";

export default class GLDrawSystem extends System {
	constructor( scene, config ) {
		super( scene );

		this.config = {
			...config
		};

		this.textures = new Map();
		this.cameraQuery = e => e.components.has( CAMERA );
		this.spriteQuery = e => e.components.has( SPRITE );
	}

	init() {

		this.canvas = document.createElement( 'canvas' );
		this.canvas.style.backgroundColor = 'black';
		this.canvas.style.imageRendering = 'pixelated';
		this.canvas.style.margin = '0 auto';
		this.canvas.style.display = 'block';
		
		this.canvas.width = 640;
		this.canvas.height = 480;
		document.body.appendChild( this.canvas );
		this.tc = TinyCanvas( this.canvas );
		// #A7ACA7
		this.tc.bkg( 0.6549019607843137, 0.6745098039215687, 0.6549019607843137);
	}

	update() {
		this.tc.cls();

		if ( ! this.camera ) {
			this.camera = this.ecs.query( this.cameraQuery )[0];
		}

		let camPosition = this.camera.components.get( POSITION );
		let camEdgeLeft = camPosition.x - ( this.canvas.width / 2 ) - 40; // 40 is arbitrary so sprite dont get cut off.
		let camEdgeRight = camPosition.x + ( this.canvas.width / 2 ) + 40;
		let camEdgeTop = camPosition.y - ( this.canvas.height / 2 ) - 40;
		let camEdgeBottom = camPosition.y + ( this.canvas.height / 2 ) + 40;

		let entities = this.ecs.query( this.spriteQuery );
		entities.sort( ( a, b ) => {
			return a.components.get( SPRITE ).depth - b.components.get( SPRITE ).depth
		} );
		entities.forEach( entity => {
			let component = entity.components;

			let position = component.get( POSITION );

			// Culling
			if ( 
				position.x < camEdgeLeft || 
				position.x > camEdgeRight ||
				position.y > camEdgeBottom || 
				position.y < camEdgeTop 
			) {
				return;
			}

			let sprite = component.get( SPRITE );
			let texture;

			let image = this.scene.game.resourceManager.get( sprite.key );
			if ( this.textures.has( sprite.key ) ) {
				texture = this.textures.get( sprite.key );
			} else {
				let _tex = CreateTexture( this.tc.g, image, sprite.width, sprite.height );
				this.textures.set( sprite.key, _tex );
				texture = _tex;
			}
			

			this.tc.push();
			this.tc.trans( position.x - camPosition.x + ( this.canvas.width / 2 ), position.y - camPosition.y + ( this.canvas.height / 2 ) );
			// this.tc.rot( 0 );
			this.tc.img( texture, 0, 0, 
				sprite.width, sprite.height, 
				sprite.originX / image.width, sprite.originY / image.height,  // U0 x V0
				( sprite.originX + sprite.width ) / image.width, ( sprite.originY + sprite.height )/ image.height // U1 x V1
			);
			this.tc.pop();
			
			let hp = component.get( HEALTH );
			if ( hp ) {
				// ctx.font = '8px sans-serif';
				// ctx.fillText( `${hp.current}/${hp.max}`, 0, 25 );
			}

			let c = component.get( INVULNERABLE );
			if ( c ) {
				// ctx.strokeStyle = '#FF0000';
				// ctx.strokeRect( 0, 0, 16, 16 );
				// ctx.strokeStyle = '#FFFFFF';
			}

		} );
		this.tc.flush();

		// ctx.font = '14px sans-serif';
		// ctx.fillText( 'FPS: ' + this.scene.game.fps, 10, 15 );
		// ctx.fillText( `CAM: ${camPosition.x}x${camPosition.y}`, 10, 30 );
		// ctx.fillText( `Sprites Drawn/Total: ${drawCalls} / ${entities.length}`, 10, 45 );
	}
}