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
		const removed = this.entities.splice( this.entities.indexOf( entity ), 1 );
		const keys = removed[0].components.forEach( component => {
			this.killComponent( component );
		} );

		removed[0].components.clear();
		this.entityPool.push( removed[0] );
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

	addComponent( entity, component ) {
		entity.components.set( component.type, component );
		this.updateQueries( entity );

		return this;
	}

	killComponent( component ) {
		if ( ! this.componentPool.has( component.type ) ) {
			this.componentPool.set( component.type, [] );
		}

		this.componentPool.get( component.type ).push( component );
	}

	updateQueries( entity ) {
		const queries = this.queries.keys();
		for ( const query of queries ) {
			const results = this.queries.get( query );
			const index = results.indexOf( entity );

			if ( query( entity ) ) {
				if ( index === - 1 ) {
					results.push( entity );
				}
			} else {
				if ( index > 0 ) {
					results.splice( index, 1 );
				}
			}
		}
	}

	query( fn ) {
		if ( this.queries.has( fn ) ) {
			return this.queries.get( fn );
		}

		const results = this.entities.filter( fn );

		this.queries.set( fn, results );

		return results;
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

	update( args ) {
		this.systems.forEach( system => system.update( args ) );
	}
}