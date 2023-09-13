import { CAMERA, POSITION } from "../helpers/Constants";
import System from "../includes/System";

export default class CameraSystem extends System {
	update( delta ) {
		if ( ! this.cam ) {
			this.cam = this.componentManager.query( e => e.components.has( CAMERA ) )[0];
		}
		let entity = this.cam;
		let position = entity.components.get( POSITION );
		let camera = entity.components.get( CAMERA );
		let focusPosition = camera.focus.components.get( POSITION );

		position.x = focusPosition.x + camera.shakeX;
		position.y = focusPosition.y; + camera.shakeY;
	}
}