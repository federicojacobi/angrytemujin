import System from "../includes/System";

export default class DebugSystem extends System {
	constructor( scene ) {
		super( scene );
		this.output = document.createElement( 'pre' );
		document.body.appendChild( this.output );
		this.query = ( e ) => e.components.has( 'debug' );
	}

	update( delta ) {
		const entities = this.ecs.query( this.query );
		if ( entities.length === 0 ) {
			return;
		}
		this.output.innerHTML = '';
		entities.forEach( entity => {
			entity.components.forEach( ( value, key ) => {
				for ( const ck in value ) {
					this.output.innerHTML += `${ck}->${value[ck]}\n`;
				}
				this.output.innerHTML += '\n';
			} );
		} );
	}
}