import { findFormationArcherSpot, findFormationSpot, findRandomEnemyInRange, moveToLocation, playerInRange, shootAtEnemy, stopMoving } from "../helpers/Behaviors";
import { ARCHER, BTREE, PROTECTOR } from "../helpers/Constants";
import { normalizeVector } from "../includes/MathHelpers";
import System from "../includes/System";
// import { BehaviorTree, Sequence, Selector, Task, SUCCESS, FAILURE } from BTREE;
import { BehaviorTree, Sequence, Selector, Task, SUCCESS, FAILURE } from '../includes/BehaviorTree'
// import { CooldownDecorator, InvertDecorator } from "behaviortree/lib/decorators";
import { CooldownDecorator, InvertDecorator } from "../includes/BehaviorTree";


export default class BTSystem extends System {
	constructor( scene, entity ) {
		super( scene );
		this.player = entity;
	}

	/**
	 * Create a Behavior Tree and add to the bt component.
	 *
	 * @param {*} entity 
	 */
	createBTree( entity ) {
		let btComponent = entity.components.get( BTREE );
		let tree;
		switch ( btComponent.type ) {
			case PROTECTOR:
				tree = new BehaviorTree( {
					tree: new Selector( {
						nodes: [
							new Sequence( {
								nodes: [
									// new InvertDecorator( {
									// 	node: new playerInRange()
									// } ),
									new findFormationSpot(),
									new moveToLocation(),
									new stopMoving(),
								]
							} ),
						],
					} ),
					blackboard: {
						player: this.player,
						entity: entity
					}
				} );
				break;

			case ARCHER:
				tree = new BehaviorTree( {
					tree: new Selector( {
						nodes: [
							new Sequence( {
								nodes: [
									// new InvertDecorator( {
									// 	node: new playerInRange()
									// } ),
									new findFormationArcherSpot(),
									new moveToLocation(),
									new stopMoving(),
								]
							} ),
							new Sequence( {
								nodes: [
									new CooldownDecorator( {
										cooldown: 4000,
										node: new Sequence( {
											nodes: [
												new findRandomEnemyInRange(),
												new shootAtEnemy(),
											]
										} )
									} ),
								]
							} )
						],
					} ),
					blackboard: {
						player: this.player,
						entity: entity,
						system: this
					}
				} );
				break;
		}
		btComponent.btree = tree;
	}

	update( delta ) {
		this.componentManager.query( e => e.components.has( BTREE ) ).forEach( entity => {
			let btComponent = entity.components.get( BTREE );
			if ( ! btComponent.btree ) {
				this.createBTree( entity );
			}

			// if ( btComponent.runAccumulator == btComponent.runEvery ) {
				btComponent.btree.step();
				// btComponent.runAccumulator = 0;
			// } else {
				// btComponent.runAccumulator ++;
			// }
		} );
	}
}