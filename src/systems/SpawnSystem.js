import System from "../includes/System";

import { ANIMATION, BODY, CAMERA, DUMB_AI, ENEMY, HEALTH, PLAYER, POSITION, SPAWN, SPRITE } from "../helpers/Constants";

export default class SpawnSystem extends System {
	constructor( scene ) {
		super( scene );
		this.query = e => e.components.has( SPAWN );
	}
	update( delta ) {
		this.ecs.query( this.query ).forEach( entity => {
			let timer = entity.components.get( SPAWN );

			if ( timer.currentTime < timer.trigger ) {
				timer.currentTime += delta;
			} else {
				if ( ! this.scene.player.components.has( PLAYER ) ) {
					return;
				}
				timer.currentTime = 0;
				let cameraPosition = this.scene.camera.components.get( POSITION );
				let cameraSize = this.scene.camera.components.get( CAMERA );

				let quadrant = Math.floor( Math.random() * 4 );
				let spawnX = 0;
				let spawnY = 0;

				switch( quadrant ) {
					case 0:
						spawnX = cameraPosition.x - 32 - cameraSize.width / 2;
						spawnY = cameraPosition.y + Math.floor( Math.random() * cameraSize.height ) - cameraSize.height / 2;
						break;

					case 1:
						spawnX = cameraPosition.x + 32 + cameraSize.width / 2;
						spawnY = cameraPosition.y + Math.floor( Math.random() * cameraSize.height ) - cameraSize.height / 2;
						break;
					
					case 2:
						spawnX = cameraPosition.x + Math.floor( Math.random() * cameraSize.width ) - cameraSize.width / 2;
						spawnY = cameraPosition.y - 32 - cameraSize.height / 2;
						break;

					case 3:
						spawnX = cameraPosition.x + Math.floor( Math.random() * cameraSize.width ) - cameraSize.width / 2;
						spawnY = cameraPosition.y + 32 + cameraSize.height / 2;
						break;
				}

				const position = this.ecs.getNextComponent( POSITION );
				position.x = spawnX;
				position.y = spawnY;

				const body = this.ecs.getNextComponent( BODY );

				const hp = this.ecs.getNextComponent( HEALTH );
				hp.current = 10;
				hp.max = 10;

				const _enemyComponent = this.ecs.getNextComponent( ENEMY );

				const dumbAI = this.ecs.getNextComponent( DUMB_AI );
				dumbAI.focus = this.scene.player;

				const sprite = this.ecs.getNextComponent( SPRITE );
				Object.assign( sprite, {
					key: 'tileset1',
					width: 16,
					height: 16,
					displayWidth: 16,
					displayHeight: 16,
					originX: 16 * 0,
					originY: 16 * 4,
					scale: 1,
					depth: 10
				} );

				const anim = this.ecs.getNextComponent( ANIMATION );
				anim.name = 'spear';
				anim.frames = [
					{
						originX: 0,
						originY: 16 * 4,
						duration: 200
					},
					{
						originX: 16,
						originY: 16 * 4,
						duration: 200
					}
				];

				let enemy = this.ecs.getNextEntity();
				this.ecs.addComponent( enemy, [ position, body, hp, _enemyComponent, sprite, anim, dumbAI ] );
			}
		} );
	}
}