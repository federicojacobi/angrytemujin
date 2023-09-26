import './style.css';

import Scene from './includes/Scene';
import Game from './includes/Game';
import ECS, { scaffold } from './includes/ECS';

import TileSet1 from './assets/tileset_opt_tiny.png';

import BodyComponent from './components/BodyComponent';

import SpriteComponent from './components/SpriteComponent';
// import AnimationComponent from './components/AnimationComponent';
import CameraComponent from './components/CameraComponent';


// import AnimationSystem from './systems/AnimationSystem';
import PhysicsSystem from './systems/PhysicsSystem';
import DrawSystem from './systems/DrawSystem';
// import GLDrawSystem from './systems/GLDrawSystem';
import KeyboardControlSystem from './systems/KeyboardControlSystem';
import PositionComponent from './components/PositionComponent';

import SpawnComponent from './components/SpawnComponent';
import SpawnSystem from './systems/SpawnSystem';
import CameraSystem from './systems/CameraSystem';
import CirclesWeaponComponent from './components/CirclesWeaponComponent';
import CircleAroundSystem from './systems/CircleAroundSystem';

import DamageComponent from './components/DamageComponent';
import DamageSystem from './systems/DamageSystem';
import InvulnerableSystem from './systems/InvunerableSystem';
import AISystem from './systems/EnemyAISystem';
import AnimationSystem from './systems/AnimationSystem';
import PlayerSystem from './systems/PlayerSystem';
import KnockbackComponent from './components/KnockbackComponent';
import BTSystem from './systems/BTSystem';
import { Random } from './includes/MathHelpers';
import { IdleHorse } from './helpers/HorseAnimations';
import SelfDestructSystem from './systems/SelfDestructSystem';
import TextComponent from './components/TextComponent';

import BTComponent from './components/BTComponent';
import AnimationComponent from './components/AnimationComponent';
import SelfDestructComponent from './components/SelfDestructComponent';
import { ANIMATION, ARCHER, BODY, BTREE, CAMERA, CIRCLESWEAPON, DAMAGE, ENEMY, FRIEND, HEALTH, INVULNERABLE, KEYBOARDCONTROL, KNOCKBACK, PLAYER, POSITION, PROTECTOR, SELFDESTRUCT, SPAWN, SPRITE, TEXT } from './helpers/Constants';
import InvulnerableComponent from './components/InvulnerableComponent';


const ecs = new ECS();
scaffold.setup( ecs );
class Scene1 extends Scene {
	preload() {
		this.load( 'tileset1', 'image', TileSet1 );
	}

	registerComponents() {
		ecs.registerComponent( { type: KEYBOARDCONTROL } );
		ecs.registerComponent( {
			type: FRIEND,
			level: 1,
			kind: PROTECTOR,
		} );
		ecs.registerComponent( {
			type: PLAYER,
			status: 1, // 1 alive, 0 dead
			level: 1,
			nextLevel: 1,
			exp: 0,
			maxUnits: 1,
			units: [],
		} );
		ecs.registerComponent( {
			type: POSITION,
			x: 0,
			y: 0,
			originX: 0,
			originY: 0,
		} );
		ecs.registerComponent( SpriteComponent );
		ecs.registerComponent( CameraComponent );
		ecs.registerComponent( BodyComponent );
		ecs.registerComponent( AnimationComponent );
		ecs.registerComponent( {
			type: HEALTH,
			max: 100,
			current: 100
		} );
	}

	create() {
		this.registerComponents();

		this.createMap();

		scaffold.create()
		.addComponent( KEYBOARDCONTROL )
		.addComponent( PLAYER )
		.addComponent( FRIEND )
		.addComponent( POSITION, { x: 5000, y: 1000 } )
		.addComponent( ANIMATION, IdleHorse )
		.addComponent( HEALTH )
		.addComponent( BODY, {
			width: 16,
			height: 16,
			speed: 150,
		} )
		.addComponent( SPRITE, {
			key: 'tileset1',
			width: 24,
			height: 16,
			displayWidth: 24,
			displayHeight: 16,
			originX: 24,
			originY: 16,
			depth: 20,
		} );

		let playerEntity = scaffold.entity;

		this.player = playerEntity;

		// this.weapon = this.entityManager.getNextEntity()
		// 	.addComponent( CIRCLESWEAPON, new CirclesWeaponComponent( Math.PI, 40, playerEntity ) )
		// 	.addComponent( POSITION, new PositionComponent() )
		// 	.addComponent( DAMAGE, new DamageComponent( 15 ) )
		// 	.addComponent( KNOCKBACK, new KnockbackComponent( 10 ) )
		// 	.addComponent( SPRITE, new SpriteComponent( {
		// 		key: 'tileset1',
		// 		width: 16,
		// 		height: 16,
		// 		displayWidth: 16,
		// 		displayHeight: 16,
		// 		originX: 16 * 4,
		// 		originY: 16 * 4,
		// 		depth: 15
		// 	} ) )
		// 	;

		scaffold.create()
		.addComponent( CAMERA, {
			width: 640,
			height: 480,
			focus: playerEntity
		} )
		.addComponent( POSITION )
		.addComponent( BODY );

		this.camera = scaffold.entity;

		// let spawn = this.entityManager.getNextEntity()
		// 	.addComponent( SPAWN, new SpawnComponent() );

		ecs.addSystem( new KeyboardControlSystem( this ) );
		// this.systemManager.add( new AISystem( this ) );
		// this.systemManager.add( new BTSystem( this, playerEntity ) );
		// this.systemManager.add( new PlayerSystem( this ) );
		// this.systemManager.add( new SpawnSystem( this ) );
		// this.systemManager.add( new InvulnerableSystem( this ) );
		// this.systemManager.add( new DamageSystem( this ) )
		// .on( 'friendKilled', ( entity ) => {
		// 	if ( this.player == entity ) return;
		// 	let playerComponent = this.player.components.get( PLAYER );
		// 	let index = playerComponent.units.indexOf( entity );
			
		// 	if ( index > -1 && playerComponent ) {
		// 		playerComponent.units.splice( index, 1 );
		// 	}


		// 	if ( entity == this.player ) {
		// 		this.emit( 'PlayerDead' );
		// 	}

		// } )
		// .on( 'entityKilled', ( entity ) => {
		// 	if ( this.player == entity ) {
		// 		this.handleDeath();
		// 		return;
		// 	};

		// 	let playerComponent = this.player.components.get( PLAYER );

		// 	// Create a new friendly unit
		// 	if ( playerComponent.units.length == playerComponent.maxUnits || Math.random() > 0.2 ) {
		// 		return;
		// 	}

		// 	const types = [ PROTECTOR, ARCHER ];
		// 	// const types = [ ARCHER ];
		// 	this.createFriendlyUnit( types[ Math.floor( Math.random() * types.length ) ], entity.components.get( POSITION ) );
		// } );

		// this.systemManager.add( new CircleAroundSystem( this ) );
		ecs.addSystem( new PhysicsSystem( this ) );
		ecs.addSystem( new AnimationSystem( this ) );
		ecs.addSystem( new CameraSystem( this ) );
		// this.systemManager.add( new SelfDestructSystem() );
		ecs.addSystem( new DrawSystem( this, {
		// this.systemManager.add( new GLDrawSystem( this, {
			width: this.game.config.width,
			height: this.game.config.height
		} ) )
		;
	}

	createFriendlyUnit( type = 0, position ) {
		const newEntity = this.entityManager.getNextEntity();
		newEntity.addComponent( BODY, new BodyComponent( {
			speed: 100
		}) )
		.addComponent( HEALTH, new HealthComponent( this.player.components.get( HEALTH ).max * 0.1, this.player.components.get( HEALTH ).max * 0.1 ) )
		.addComponent( INVULNERABLE, new InvulnerableComponent( 1000 ) )
		.addComponent( POSITION, new PositionComponent( position.x, position.y ) );

		switch( type ) {
			case PROTECTOR:
				newEntity
				.addComponent( BTREE, new BTComponent( PROTECTOR ) )
				.addComponent( KNOCKBACK, new KnockbackComponent( 15 ) )
				.addComponent( DAMAGE, new DamageComponent( this.player.components.get( PLAYER ).level * 5 ) )
				.addComponent( FRIEND, new FriendComponent() )
				.addComponent( ANIMATION, new AnimationComponent( {
					name: '',
					frames: [
						{
							originX: 16 * 2,
							originY: 16 * 4,
							duration: 200
						},
						{
							originX: 16 * 3,
							originY: 16 * 4,
							duration: 200
						}
					]
				} ) )
				.addComponent( SPRITE, new SpriteComponent( {
					key: 'tileset1',
					width: 16,
					height: 16,
					originX: 32,
					originY: 64,
					displayWidth: 16,
					displayHeight: 16,
					depth: 20
				} ) );
				break;

			case ARCHER:
				newEntity
				.addComponent( BTREE, new BTComponent( ARCHER ) )
				.addComponent( FRIEND, new FriendComponent() )
				.addComponent( ANIMATION, new AnimationComponent( {
					name: '',
					frames: [
						{
							originX: 16 * 2,
							originY: 16 * 5,
							duration: 200
						},
						{
							originX: 16 * 3,
							originY: 16 * 5,
							duration: 200
						}
					]
				} ) )
				.addComponent( SPRITE, new SpriteComponent( {
					key: 'tileset1',
					width: 16,
					height: 16,
					originX: 32,
					originY: 16 * 5,
					displayWidth: 16,
					displayHeight: 16,
					depth: 20
				} ) );
				break;
		}

		this.player.components.get( PLAYER ).units.push( newEntity );

		if ( Math.random() > 0.85 ) {
			let label = this.entityManager.getNextEntity();
			label.addComponent( TEXT, new TextComponent( {
				text: ['GLORY TO CHINGGIS KHAN!', 'I YIELD TO MY KHAN!', 'GENGHIS KHAN LIVES!'][ Math.floor( Math.random() * 3 ) ],
				color: '#000000',
				font: '10px sans-serif'
			}) )
			.addComponent( POSITION, new PositionComponent( position.x, position.y - 15 ) )
			.addComponent( SELFDESTRUCT, new SelfDestructComponent( 2000 ) );
		}
	}

	handleDeath() {
		this.componentManager.query( (e) => e.components.has( ENEMY ) ).forEach( e => e.components.delete( ENEMY ) );
		this.player.components.get( PLAYER ).status = 0;
		this.entityManager.getNextEntity()
		.addComponent( POSITION, new PositionComponent( this.player.components.get(POSITION).x, this.player.components.get(POSITION).y - 60 ) )
		.addComponent( TEXT, new TextComponent( {
			text: 'Game Over',
			textAlign: 'center',
			font: '40px sans-serif'
		} ) );
		this.entityManager.getNextEntity()
		.addComponent( POSITION, new PositionComponent( this.player.components.get(POSITION).x , this.player.components.get(POSITION).y - 30) )
		.addComponent( TEXT, new TextComponent( {
			text: 'The great Genghis Khan doesn\'t die like this.',
			textAlign: 'center',
			font: '24px sans-serif'
		} ) );
		this.entityManager.getNextEntity()
		.addComponent( POSITION, new PositionComponent( this.player.components.get(POSITION).x, this.player.components.get(POSITION).y + 30) )
		.addComponent( TEXT, new TextComponent( {
			text: 'Reload the page to restart',
			textAlign: 'center',
			font: '24px sans-serif'
		} ) );
		this.entityManager.kill( this.weapon );
	}

	createMap() {
		const rng = Random( 1200 );

		for ( let x = -1000; x < 11000; x = x + 16 ) {
			for ( let y = -1000; y < 7000; y = y + 16 ) {
				const maybeTile = rng();
				if ( maybeTile < 0.2 ) {
					let usableTiles;
					if ( x < 4000 ) {
						usableTiles = [ [2,0], [3,0],[4,0],[5,0] ];
					} else if ( x > 4000 && x < 7000 ) {
						usableTiles = [ [0,0], [1,0],[3,0],[6,0] ];
					} else {
						usableTiles = [ [3,0], [4,0],[7,0],[1,0] ];
					}

					let thisTile = usableTiles[ Math.round( rng() * ( usableTiles.length - 1 ) ) ];

					scaffold.create()
						.addComponent( POSITION, { x: x, y: y } )
						.addComponent( SPRITE, {
							key: 'tileset1',
							width: 16,
							height: 16,
							displayWidth: 16,
							displayHeight: 16,
							originX: 16 * thisTile[0],
							originY: 16 * thisTile[1],
							depth: 1,
						} );
				}
			}
		}
	}

	update( delta ) {
		ecs.update( delta );
		super.update( delta );
	}
}

window.game = new Game( {
	width: 640,
	height: 480,
	scenes: [ new Scene1() ],
} );
