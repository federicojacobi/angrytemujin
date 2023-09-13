export default class ResourceManager {
	constructor() {
		this.promises = [];

		this.resources = {};
	}

	load( id, type, resource ) {
		if ( this.resources.hasOwnProperty( 'id' ) ) {
			throw `ID: ${id} already exists`;
		}

		switch( type ) {
			case 'image':
			let image = new Image();
			image.src = resource;

			let promise = new Promise( ( resolve, reject ) => {
				image.addEventListener( 'load', () => {
					resolve();
				} );
			} );

			this.resources[ id ] = {
				data: image,
				promise: promise
			};
			this.promises.push( promise );
			break;

			default:
			console.error( `CANT LOAD ${type} type` );
		}
	}

	get( id ) {
		return this.resources[id].data;
	}
}