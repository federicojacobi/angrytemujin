import { BODY, ENEMY, PLAYER, POSITION } from "../helpers/Constants";
import System from "../includes/System";

export default class PlayerSystem extends System {
	constructor( scene ) {
		super( scene );
	}

	update( delta ) {
		let playerComponent = this.scene.player.components.get( PLAYER );
		// Handle levels
		if ( playerComponent.exp >= playerComponent.nextLevel ) {
			playerComponent.nextLevel = Math.round( ( 4 * ( playerComponent.level ** 3 ) ) / 5 );
			playerComponent.level++;
			if ( playerComponent.maxUnits < 30 ) {
				playerComponent.maxUnits ++;
			}
		}
	}
}