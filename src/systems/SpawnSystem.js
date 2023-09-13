import BodyComponent from "../components/BodyComponent";
import EnemyComponent from "../components/EnemyComponent";
import HealthComponent from "../components/HealthComponent";
import PositionComponent from "../components/PositionComponent";
import SpriteComponent from "../components/SpriteComponent";
import AIComponent from "../components/AIComponent";
import System from "../includes/System";
import AnimationComponent from "../components/AnimationComponent";
import { ANIMATION, BODY, CAMERA, DUMB_AI, ENEMY, HEALTH, PLAYER, POSITION, SPAWN, SPRITE } from "../helpers/Constants";

export default class SpawnSystem extends System {
	update( delta ) {
		this.componentManager.query( e => e.components.has( SPAWN ) ).forEach( entity => {
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
				
				let enemy = this.entityManager.getNextEntity()
					.addComponent( POSITION, new PositionComponent( spawnX, spawnY ) )
					.addComponent( BODY, new BodyComponent() )
					.addComponent( HEALTH, new HealthComponent( 10, 10 ) )
					.addComponent( ENEMY, new EnemyComponent() )
					.addComponent( DUMB_AI, new AIComponent( this.scene.player ) )
					.addComponent( SPRITE, new SpriteComponent( {
						key: 'tileset1',
						width: 16,
						height: 16,
						displayWidth: 16,
						displayHeight: 16,
						originX: 16 * 0,
						originY: 16 * 4,
						scale: 1,
						depth: 10
					} ) )
					.addComponent( ANIMATION, new AnimationComponent( {
						name: 'spear',
						frames: [
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
						]
					} ) );
			}
		} );
	}
}