import { FAILURE, RUNNING, SUCCESS, Task } from "../includes/BehaviorTree";

import { BODY, BOTTOM, DAMAGE, ENEMY, LEFT, PLAYER, POSITION, RIGHT, SELFDESTRUCT, SPRITE, TOP } from "./Constants";
import { distanceBetweenPoints, normalizeVector } from "../includes/MathHelpers";

import BodyComponent from "../components/BodyComponent";
import SpriteComponent from "../components/SpriteComponent";
import DamageComponent from "../components/DamageComponent";

export class playerInRange extends Task {
	run( blackboard ) {
		const playerPos = blackboard.player.components.get( POSITION );
		const entityPos = blackboard.entity.components.get( POSITION );
		const distance = Math.sqrt(
			Math.pow( entityPos.x - playerPos.x, 2 ) +
			Math.pow( entityPos.y - playerPos.y, 2 )
		);

		if ( distance < 100 ) {
			return SUCCESS;
		}
		return FAILURE;
	}
};

export class findFormationSpot extends Task {
	run( blackboard ) {
		let player = blackboard.player.components.get( PLAYER );
		let facing = blackboard.player.components.get( BODY ).facing;
		let playerPos = blackboard.player.components.get( POSITION );
		const SPACEBETWEEN = 24;

		let protectors = player.units.filter( e => e.components.has( DAMAGE ) );
		if ( protectors.length === 0 ) {
			return FAILURE;
		}

		const formationIndex = protectors.indexOf( blackboard.entity );

		switch ( facing ) {
			case TOP:
				blackboard.targetPosition = {
					x: playerPos.x - Math.round( protectors.length * SPACEBETWEEN / 2 ) + ( formationIndex * SPACEBETWEEN ),
					y: playerPos.y - 40
				};
				break;

			case BOTTOM:
				blackboard.targetPosition = {
					x: playerPos.x - Math.round( protectors.length * SPACEBETWEEN / 2 ) + ( formationIndex * SPACEBETWEEN ),
					y: playerPos.y + 40
				};
				break;

			case LEFT:
				blackboard.targetPosition = {
					x: playerPos.x - 40,
					y: playerPos.y - Math.round( protectors.length * SPACEBETWEEN / 2 ) + ( formationIndex * SPACEBETWEEN ),
				};
				break;

			case RIGHT:
				blackboard.targetPosition = {
					x: playerPos.x + 40,
					y: playerPos.y - Math.round( protectors.length * SPACEBETWEEN / 2 ) + ( formationIndex * SPACEBETWEEN ),
				};
				break;
		}

		let ePos = blackboard.entity.components.get( POSITION );
		if ( ePos.x == blackboard.targetPosition.x && ePos.y == blackboard.targetPosition.y ) {
			return FAILURE;
		}
		return SUCCESS;
	}
};

export class findFormationArcherSpot extends Task {
	run( blackboard ) {
		let player = blackboard.player.components.get( PLAYER );
		let facing = blackboard.player.components.get( BODY ).facing;
		let playerPos = blackboard.player.components.get( POSITION );
		const SPACEBETWEEN = 24;
		const GRID_WIDTH = 3;

		let archers = player.units.filter( e => ! e.components.has( DAMAGE ) );
		if ( archers.length === 0 ) {
			return FAILURE;
		}

		const formationIndex = archers.indexOf( blackboard.entity );

		switch ( facing ) {
			case TOP:
			case RIGHT:
				blackboard.targetPosition = {
					x: playerPos.x - GRID_WIDTH * 16 - SPACEBETWEEN * GRID_WIDTH + ( formationIndex % GRID_WIDTH ) * SPACEBETWEEN,
					y: playerPos.y + ( ( 16 + SPACEBETWEEN ) * ( formationIndex / GRID_WIDTH ) )
				};
				break;

			case BOTTOM:
			case LEFT:
				blackboard.targetPosition = {
					x: playerPos.x + SPACEBETWEEN * GRID_WIDTH + ( formationIndex % GRID_WIDTH ) * SPACEBETWEEN,
					y: playerPos.y - ( ( 16 + SPACEBETWEEN ) * ( formationIndex / GRID_WIDTH ) )
				};
				break;
		}

		let ePos = blackboard.entity.components.get( POSITION );
		if ( ePos.x == blackboard.targetPosition.x && ePos.y == blackboard.targetPosition.y ) {
			return FAILURE;
		}
		return SUCCESS;
	}
};


export class moveToLocation extends Task {

	start( blackboard ) {
		let tp = blackboard.targetPosition;
		let entityPosition = blackboard.entity.components.get( POSITION );
		let normalizedDirection = normalizeVector( tp.x - entityPosition.x, tp.y - entityPosition.y );

		const body = blackboard.entity.components.get( BODY );

		body.velocity.x = normalizedDirection.x * body.speed;
		body.velocity.y = normalizedDirection.y * body.speed;

		blackboard.distance = distanceBetweenPoints( tp.x, tp.y, entityPosition.x, entityPosition.y );
		blackboard.startingPoint = {
			x: entityPosition.x,
			y: entityPosition.y
		};
	}

	run( blackboard ) {
		let tp = blackboard.targetPosition;
		let entityPosition = blackboard.entity.components.get( POSITION );

		const currentDistance = distanceBetweenPoints( blackboard.startingPoint.x, blackboard.startingPoint.y, entityPosition.x, entityPosition.y );

		if ( currentDistance >= blackboard.distance ) {
			entityPosition.x = tp.x;
			entityPosition.y = tp.y;

			return SUCCESS;
		}

		return RUNNING;
	}
};

export class stopMoving extends Task {
	start( blackboard ) {
		let body = blackboard.entity.components.get( BODY );
		body.velocity.x = 0;
		body.velocity.y = 0;
	}
	run() {
		return SUCCESS;
	}
};

export class findRandomEnemyInRange extends Task {
	start( blackboard ) {
		blackboard.enemies = blackboard.system.componentManager.query( e => e.components.has( ENEMY ) );
	}

	run( blackboard ) {
		const ePos = blackboard.entity.components.get( POSITION );

		const closeEnoughEnemies = blackboard.enemies.filter( e => {
			let pos = e.components.get( POSITION );
			return distanceBetweenPoints( ePos.x, ePos.y, pos.x, pos.y ) < 200;
		} );

		if ( closeEnoughEnemies.length > 0 ) {
			const enemy = closeEnoughEnemies[ Math.floor( Math.random() * closeEnoughEnemies.length ) ];
			blackboard.targetPosition = enemy.components.get( POSITION );

			return SUCCESS;
		} else {
			return FAILURE;
		}

	}
};

export class shootAtEnemy extends Task {
	run( blackboard ) {
		const origin = blackboard.entity.components.get( POSITION );
		const target = blackboard.targetPosition;

		const e = blackboard.system.entityManager.getNextEntity();
		const normal = normalizeVector( target.x - origin.x, target.y - origin.y );

		e.addComponent( POSITION, new PositionComponent( origin.x, origin.y ) )
		.addComponent( DAMAGE, new DamageComponent( 15 ) )
		.addComponent( BODY, new BodyComponent( {
			speed: 300,
			velocity: {
				x: normal.x * 300,
				y: normal.y * 300
			},
		} ) )
		.addComponent( SPRITE, new SpriteComponent( {
			key: 'tileset1',
			width: 16,
			height: 16,
			displayWidth: 16,
			displayHeight: 16,
			originX: 16 * 4,
			originY: 16 * 5,
			depth: 15
		} ) )
		.addComponent( SELFDESTRUCT, new SelfDestructComponent( 1000 ) )
		return SUCCESS;
	}
};
