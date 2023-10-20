export default class Scene {
	constructor( game ) {

		this.game = game;

		this.tweens = [];
	}

	load( id, type, resource ) {
		this.game.resourceManager.load( id, type, resource );
	}

	preload() {}

	create() {}

	preupdate( delta, timestamp ) {}

	update( delta, timestamp ) {}

	postupdate( delta, timestamp ) {}

	destroy() {
	}
}