import AnimationManager from "./AnimationManager";
import EventEmitter from "./EventEmitter";
import ResourceManager from "./ResourceManager";

let lastFrameTimestamp = 0;

export default class Game extends EventEmitter {
	constructor( config ) {
		super();
		
		this.config = {
			width: 640,
			height: 480,
			scenes: [],
			canvas: null,
			...config
		};

		this.animationFrame = null;
		
		this.frames = 0;
		this.perSecond = 0;
		this.fps = 0;

		this.resourceManager = new ResourceManager();
		this.animationManager = new AnimationManager();

		this.init();
	}

	init() {
		this.activeScene = this.config.scenes[0];
		this.config.scenes.forEach( scene => scene.game = this );
		
		this.activeScene.preload();

		Promise.all( this.resourceManager.promises ).then( () => {
			this.activeScene.create();

			lastFrameTimestamp = performance.now();

			window.addEventListener( 'blur', () => {
				cancelAnimationFrame( this.animationFrame );

				window.addEventListener( 'focus', () => {
					lastFrameTimestamp = performance.now();
					requestAnimationFrame( this.update.bind( this ) );
				}, {
					once: true
				} );
			} );

			this.animationFrame = requestAnimationFrame( this.update.bind( this ) );
		} );
	}

	update( timestamp ) {
		let delta = ( timestamp - lastFrameTimestamp );
		lastFrameTimestamp = timestamp;
	
		this.activeScene.preupdate( delta, timestamp );

		this.activeScene.update( delta, timestamp );

		this.activeScene.postupdate( delta, timestamp );
	
		this.animationFrame = requestAnimationFrame( this.update.bind( this ) );
		this.frames++;
		this.perSecond += delta;

		if ( this.perSecond > 1000 ) {
			this.fps = Math.round( this.frames / this.perSecond * 1000 );
			this.perSecond = 0;
			this.frames = 0;
		}
		this.emit( 'update' );
	}

	destroy() {
		cancelAnimationFrame( this.animationFrame );
		this.config.scenes.forEach( s => s.destroy() );
		console.log( 'GAME DESTROYED' );
	}
}