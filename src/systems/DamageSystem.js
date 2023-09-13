import System from "../includes/System";
import InvulnerableComponent from "../components/InvulnerableComponent";
import {normalizeVector} from "../includes/MathHelpers";
import BTComponent from "../components/BTComponent";
import KnockbackComponent from "../components/KnockbackComponent";
import DamageComponent from "../components/DamageComponent";
import PositionComponent from "../components/PositionComponent";
import TextComponent from "../components/TextComponent";
import SelfDestructComponent from "../components/SelfDestructComponent";
import FriendComponent from "../components/FriendComponent";
import SpriteComponent from "../components/SpriteComponent";
import AnimationComponent from "../components/AnimationComponent";
import { BODY, DAMAGE, ENEMY, FRIEND, HEALTH, INVULNERABLE, KNOCKBACK, PLAYER, POSITION, SELFDESTRUCT, SPRITE, TEXT } from "../helpers/Constants";

export default class DamageSystem extends System {

	createDamageLabel( entity, damageTaken ) {
		let position = entity.components.get( POSITION );
		let label = this.entityManager.getNextEntity();
		label.addComponent( TEXT, new TextComponent( {
			text: damageTaken,
			color: '#FF0000',
			font: '8px sans-serif'
		}) )
		.addComponent( POSITION, new PositionComponent( position.x, position.y ) )
		.addComponent( SELFDESTRUCT, new SelfDestructComponent( 500 ) );

		this.scene.addTween( {
			duration: 500,
			target: label.components.get( POSITION ),
			property: 'y',
			startValue: position.y,
			endValue: position.y - 10
		} );
	}

	update( delta ) {
		let damageEntities = this.componentManager.query( e => e.components.has( DAMAGE ) );
		let enemies = this.componentManager.query( e => e.components.has( ENEMY ) && e.components.has( HEALTH ) );
		let friends = this.componentManager.query( e => e.components.has( FRIEND ) );

		// Check friends being hit by enemies.
		enemies.forEach( enemyEntity => {
			let enemyPosition = enemyEntity.components.get( POSITION );
			let enemyBody = enemyEntity.components.get( BODY );

			friends.forEach( ( friendEntity, index ) => {
				// Not excluded in query because this state can change after the query
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
						friends.splice( index, 1 );
						this.killEntity( friendEntity );
					} else {
						friendEntity.addComponent( INVULNERABLE, new InvulnerableComponent( 500 ) );
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
							entity.addComponent( INVULNERABLE, new InvulnerableComponent( 1000 ) );
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
		this.entityManager.getNextEntity().addComponent( SPRITE, new SpriteComponent( {
			key: 'tileset1',
			width: 8,
			height: 8,
			originX: 8 * 3,
			originY: 8 * ( Math.random() > 0.5 ? 7 : 6 ),
			displayWidth: 8,
			displayHeight: 8,
			depth: 1
		} ) )
		.addComponent( POSITION, entity.components.get( POSITION ) );

		if ( entity.components.has( FRIEND ) ) {
			this.emit( 'friendKilled', entity );
		}
		this.emit( 'entityKilled', entity );

		this.entityManager.kill( entity );
	}
}