import ComponentManager from "./ComponentManager";
import EntityManager from "./EntityManager";
import SystemManager from "./SystemManager";

function lerp( start_value, end_value, pct ) {
    return ( start_value + (end_value - start_value) * pct );
}

export default class Scene {
	constructor( game ) {
		this.entityManager = new EntityManager();
		this.componentManager = new ComponentManager( this.entityManager );
		this.systemManager = new SystemManager( this.componentManager );

		this.game = game;

		this.tweens = [];
	}

	addTween( tween ) {
		const tweenObject = {
			duration: 1000,
			elapsed: 0,
			pct: 0,
			target: null, //object
			property: '',
			startValue: 0,
			endValue: 1,
			callback: null,
			easingFunction: ( x ) => -(Math.cos(Math.PI * x) - 1) / 2,
			...tween
		};
		this.tweens.push( tweenObject );
		return tweenObject;
	}

	processTweens( delta ) {
		this.tweens.forEach( ( tween, index ) => {
			tween.elapsed += delta;
			tween.pct = tween.elapsed / tween.duration;
			if ( tween.pct >= 1 ) {
				tween.callback && tween.callback() 
				this.tweens.splice( index, 1 );
			} else {
				tween.target[tween.property] = lerp( tween.startValue, tween.endValue, tween.easingFunction( tween.pct ) );
			}
		} );
	}

	load( id, type, resource ) {
		this.game.resourceManager.load( id, type, resource );
	}

	preload() {}

	create() {}

	preupdate( delta, timestamp ) {}

	update( delta, timestamp ) {
		this.processTweens( delta );
		this.systemManager.update( delta );
	}

	postupdate( delta, timestamp ) {}

	destroy() {
		this.entityManager.destroy();
		this.componentManager.destroy();
		this.systemManager.destroy();
	}
}