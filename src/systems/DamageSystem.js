import System from "../includes/System";
import {normalizeVector} from "../includes/MathHelpers";

import SpriteComponent from "../components/SpriteComponent";

import { BODY, DAMAGE, ENEMY, FRIEND, HEALTH, INVULNERABLE, KEYBOARDCONTROL, KNOCKBACK, PLAYER, POSITION, SELFDESTRUCT, SPRITE, TEXT, TWEEN } from "../helpers/Constants";

export default class DamageSystem extends System {
	constructor( scene ) {
		super( scene );
		
		this.damageEntitiesQuery = e => e.components.has( DAMAGE );
		this.enemiesQuery = e => e.components.has( ENEMY ) && e.components.has( HEALTH );
		this.friendsQuery = e => e.components.has( FRIEND );
	}

	createDamageLabel( entity, damageTaken ) {
		const position = entity.components.get( POSITION );

		const label = this.ecs.getNextEntity();
		const text = this.ecs.getNextComponent( TEXT );
		text.text = damageTaken;
		text.color = '#FF0000';
		text.font = '8px sans-serif';

		const labelPos = this.ecs.getNextComponent( POSITION );
		labelPos.x = position.x;
		labelPos.y = position.y;

		const selfDestruct = this.ecs.getNextComponent( SELFDESTRUCT );
		selfDestruct.ttl = 500;
		selfDestruct.current = 0;

		const tween = this.ecs.getNextComponent( TWEEN );
		Object.assign( tween, {
			duration: 500,
			elapsed: 0,
			pct: 0,
			target: labelPos,
			property: 'y',
			startValue: position.y,
			endValue: position.y - 10
		} );

		this.ecs.addComponent( label, [ text, labelPos, selfDestruct, tween ] );
	}

	update( delta ) {
		let damageEntities = this.ecs.query( this.damageEntitiesQuery );
		let enemies = this.ecs.query( this.enemiesQuery );
		let friends = this.ecs.query( this.friendsQuery );

		// Check friends being hit by enemies.
		enemies.forEach( enemyEntity => {
			let enemyPosition = enemyEntity.components.get( POSITION );
			let enemyBody = enemyEntity.components.get( BODY );

			friends.forEach( ( friendEntity, index ) => {
				// Not excluded in query because this state can change after the query
				// Example: being hit by another enemy.
				if ( friendEntity.components.has( INVULNERABLE ) ) {
					return;
				}

				let fPosition = friendEntity.components.get( POSITION );
				let fBody = friendEntity.components.get( BODY );
				
				if (
					fPosition.x < enemyPosition.x + enemyBody.width &&
					fPosition.x + fBody.width > enemyPosition.x &&
					fPosition.y < enemyPosition.y + enemyBody.height &&
					fPosition.y + fBody.height > enemyPosition.y
					)
				{
					let hp = friendEntity.components.get( HEALTH );
					hp.current -= enemyEntity.components.get( ENEMY ).damageOnHit;

					this.createDamageLabel( friendEntity, enemyEntity.components.get( ENEMY ).damageOnHit );

					if ( hp.current <= 0 ) {
						hp.current = 0;
						friends.splice( index, 1 );
						this.killEntity( friendEntity );
					} else {
						const invul = this.ecs.getNextComponent( INVULNERABLE );
						invul.duration = 500;
						this.ecs.addComponent( friendEntity, invul );
					}
				}
			} );
		} );


		// Arrows, knockback, friendly fire, etc
		damageEntities.forEach( damageEntity => {

			let damageEntityComponents = damageEntity.components;
			const damagePosition = damageEntityComponents.get( POSITION );
			const damageBody = damageEntityComponents.get( DAMAGE );
			
			enemies.forEach( ( entity, index ) => {
				let enemyPosition = entity.components.get( POSITION );
				const enemyBody = entity.components.get( BODY );

				if (
					damagePosition.x < enemyPosition.x + enemyBody.width &&
					damagePosition.x + damageBody.width > enemyPosition.x &&
					damagePosition.y < enemyPosition.y + enemyBody.height &&
					damagePosition.y + damageBody.height > enemyPosition.y
					)
				{
					if ( ! entity.components.has( INVULNERABLE ) ) {
						let enemyHP = entity.components.get( HEALTH );
						enemyHP.current -= damageBody.baseDamage;
						this.createDamageLabel( entity, damageBody.baseDamage );
						if ( enemyHP.current <= 0 ) {
							enemies.splice( index, 1 );
							this.killEntity( entity );
						} else {
							const invul = this.ecs.getNextComponent( INVULNERABLE );
							invul.duration = 1000;
							this.ecs.addComponent( entity, invul );

							if ( damageEntityComponents.has( KNOCKBACK ) ) {
								// Calculate knockback
								let playerPosition = this.scene.player.components.get( POSITION );
	
								let normalizedDirection = normalizeVector( enemyPosition.x - playerPosition.x, enemyPosition.y - playerPosition.y );
	
								let newX = normalizedDirection.x * damageEntityComponents.get( KNOCKBACK ).force + enemyPosition.x;
								let newY = normalizedDirection.y * damageEntityComponents.get( KNOCKBACK ).force + enemyPosition.y;
								this.scene.addTween( {
									duration: 300,
									target: entity.components.get( POSITION ),
									property: 'x',
									startValue: enemyPosition.x,
									endValue: newX
								} );
								this.scene.addTween( {
									duration: 300,
									target: entity.components.get( POSITION ),
									property: 'y',
									startValue: enemyPosition.y,
									endValue: newY
								} );
							}
						}
					}
				}
			} );
		} );
	}

	killEntity( entity ) {
		if ( this.scene.player.components.has( PLAYER ) && entity.components.has( ENEMY ) ) {
			this.scene.player.components.get( PLAYER ).exp ++;
		}

		// BLOOD
		const blood = this.ecs.getNextEntity();
		const spriteComponent = this.ecs.getNextComponent( SPRITE );
		Object.assign( spriteComponent, {
			key: 'tileset1',
			width: 8,
			height: 8,
			originX: 8 * 3,
			originY: 8 * ( Math.random() > 0.5 ? 7 : 6 ),
			displayWidth: 8,
			displayHeight: 8,
			depth: 1
		} );

		const entityPos = entity.components.get( POSITION );
		const positionComponent = this.ecs.getNextComponent( POSITION );
		positionComponent.x = entityPos.x;
		positionComponent.y = entityPos.y;

		this.ecs.addComponent( blood, [ spriteComponent, positionComponent ] );

		if ( entity.components.has( FRIEND ) ) {
			this.emit( 'friendKilled', entity );
		}
		this.emit( 'entityKilled', entity );

		if ( entity === this.scene.player ) {
			this.ecs.removeComponent( entity, [ FRIEND, KEYBOARDCONTROL ] );
		} else {
			this.ecs.killEntity( entity );
		}
	}
}