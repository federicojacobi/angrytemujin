const entities = [];
let nextEntityId = 1;

export class Entity {
	constructor() {
		this.components = new Map();
	}

	addComponent( key, component ) {
		this.components.set( key, component );
		return this;
	}

	removeComponent( key ) {
		this.components.delete( key );
	}
}

export default class EntityManager {
	getNextEntity() {
		const _entity = new Entity();
		entities.push( _entity );
		return _entity;
	}

	getAll() {
		return entities;
	}

	kill( entity ) {
		entities.splice( entities.indexOf( entity ), 1 ).components = null;
		entity = null;
	}
}
