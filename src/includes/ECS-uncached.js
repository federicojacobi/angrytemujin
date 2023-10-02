import { Entity } from './Entity.js';

export const scaffold = {
	/**
	 * Setup ECS for use later.
	 *
	 * @param {ECS} ecs 
	 */
	setup( ecs ) {
		this.ecs = ecs;
	},

	/**
	 * Create a new entity.
	 *
	 * @returns this
	 */
	create() {
		this.entity = this.ecs.getNextEntity();
		return this;
	},

	/**
	 * Create a new component and add to the current entity.
	 *
	 * @param {*} component 
	 * @returns 
	 */
	addComponent( component, args = null ) {
		const _component = this.ecs.getNextComponent( component );
		this.ecs.addComponent( this.entity, _component );
		if ( args !== null ) {
			Object.assign( _component, args );
		}
		return this;
	}
};


export default class ECS {
	constructor() {
		this.entities = [];
		this.entityPool = [];

		this.dirtyEntities = [];
		this.dirtyComponents = [];

		this.queries = new Map();
		this.blueprint = new Map();
		this.componentPool = new Map();

		this.systems = [];
	}

	getNextEntity() {
		let _entity;
		if ( this.entityPool.lenth > 0 ) {
			_entity = this.entityPool.pop();
		} else {
			_entity = new Entity();
		}
		this.entities.push( _entity );

		return _entity;
	}

	killEntity( entity ) {
		this.dirtyEntities.push( entity );
	}

	registerComponent( c ) {
		this.blueprint.set( c.type, c );
	}

	getNextComponent( type ) {
		if ( this.componentPool.has( type ) && this.componentPool.get( type ).length > 0 ) {
			return this.componentPool.get( type ).pop();
		}

		if ( ! this.blueprint.has( type ) ) {
			throw new Error( `${type} component is not registered` );
		}
		return { ...this.blueprint.get( type ) };
	}

	removeComponent( entity, components = [] ) {
		if ( Array.isArray( components ) ) {
			components.forEach( component => {
				entity.components.delete( component );
			} );
		} else {
			entity.components.delete( components );
		}

		return this;
	}

	addComponent( entity, components = [] ) {
		if ( Array.isArray( components ) ) {
			components.forEach( component => {
				entity.components.set( component.type, component );
			} );
		} else {
			entity.components.set( components.type, components );
		}

		return this;
	}

	killComponent( component ) {
		this.dirtyComponents.push( component );
	}

	query( fn ) {
		return this.entities.filter( fn );;
	}

	addSystem( system ) {
		if ( this.systems.indexOf( system ) === -1 ) {
			this.systems.push( system );
			system.ecs = this;
			system.init();

			return system;
		}
		throw new Error( 'This system already exists' );
	}

	cleanup() {
		while ( this.dirtyEntities.length > 0 ) {
			const entity = this.dirtyEntities.pop();
			const removed = this.entities.splice( this.entities.indexOf( entity ), 1 )[0];
			removed.components.forEach( component => {
				this.killComponent( component );
			} );
	
			removed.components.clear();
			this.entityPool.push( removed );
		}

		while ( this.dirtyComponents.length > 0 ) {
			const component  = this.dirtyComponents.pop();
			if ( ! this.componentPool.has( component.type ) ) {
				this.componentPool.set( component.type, [] );
			}
	
			this.componentPool.get( component.type ).push( component );
		}
	}

	update( args ) {
		this.systems.forEach( system => system.update( args ) );
		this.cleanup();
	}
}