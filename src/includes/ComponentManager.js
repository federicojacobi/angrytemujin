const components = new Map();
const queries = new Map();

export default class ComponentManager {
	constructor( _entityManager ) {
		if ( _entityManager ) {
			this.entityManager = _entityManager;
		} else {
			throw 'You must specify an Entity Manager when creating a component manager';
		}
	}

	query( fn ) {
		return this.entityManager.getAll().filter( fn );
	}
}
