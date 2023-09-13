export default class EventEmitter {
	constructor() {
		this.eventListeners = {};
	}

	on( event, callback, once ) {
		if ( ! this.eventListeners[event] ) {
			this.eventListeners[event] = [];	
		}
		this.eventListeners[event].push( {
			callback: callback,
			once: once
		} );
		return this;
	}

	once( event, callback ) {
		this.on( event, callback, true );
		return this;
	}

	off( event, callback ) {
		if ( this.eventListeners[event] ) {
			let eventData = this.eventListeners[event].filter( e => e.callback == callback );
			eventData.forEach( e => {
				let i = this.eventListeners[event].indexOf( e );
				this.eventListeners[event].splice( i, 1 );
			} );
		}
	}

	emit( event, data ) {
		if ( this.eventListeners[ event ] ) {
			let remove = [];
			this.eventListeners[ event ].forEach( ( e ) => {
				e.callback( data );
				if ( e.once ) {
					remove.push( {
						eventName: event,
						callback: e.callback
					} );
				}
			} );

			remove.forEach( e => { this.off( e.eventName, e.callback ); } );
		}
	}
}