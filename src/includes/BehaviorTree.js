export const SUCCESS = 1, FAILURE = 2, RUNNING = 3;

export class BehaviorTree {
	constructor( args ) {
		this.blackboard = args.blackboard;
		this.root = args.tree;
	}
	step() {
		this.root.step( this.blackboard );
	}
}

export class Task {
	constructor( args ) {
		this.status = null;
	}

	start( blackboard ) {
		// this.params.start( blackboard );
	}

	run( blackboard ) {
		// return this.params.run( blackboard );
		return SUCCESS;
	}

	end( blackboard ) {
		// this.params.end( blackboard );
	}

	step( blackboard ) {
		if ( this.status !== RUNNING ) {
			this.start( blackboard );
		}
		this.status = this.run( blackboard );
		if ( this.status !== RUNNING ) {
			this.end( blackboard );
		}
		return this.status;
	}
}

export class Decorator extends Task {
	constructor( args ) {
		super();
		this.child = args.node;
	}
}

export class InvertDecorator extends Decorator {
	step() {
		const status = this.child.step();
		if ( status === RUNNING ) return status;
		return ! status;
	}
}

export class CooldownDecorator extends Decorator {
	constructor( args ) {
		super( args );
		this.cooldown = args.cooldown;
		this.timeout = false;
	}

	step( blackboard ) {
		this.status = FAILURE;
		if ( ! this.timeout ) {
			this.timeout = setTimeout( () => {
				this.status = this.child.step( blackboard );
				this.timeout = false;
			}, this.cooldown );
		}
		return this.status;
	}
}

export class Composite extends Task {
	constructor( args ) {
		super();
		this.children = args.nodes;
	}
}

export class Sequence extends Composite {
	start() {
		this.currentChildIndex = 0;
	}

	run( blackboard ) {
		while ( true ) {
			const status = this.children[ this.currentChildIndex ].step( blackboard );
			if ( status !== SUCCESS ) {
				return status;
			}
			this.currentChildIndex++;
			if ( this.currentChildIndex == this.children.length ) {
				return SUCCESS;
			}
		}
	}
}

export class Selector extends Composite {
	start() {
		this.currentChildIndex = 0;
	}

	run( blackboard ) {
		while ( true ) {
			if ( this.children.length === 0 ) return FAILURE;

			const status = this.children[ this.currentChildIndex ].step( blackboard );

			if ( status !== FAILURE ) {
				return status;
			}
			this.currentChildIndex++;
			if ( this.currentChildIndex == this.children.length ) {
				return FAILURE;
			}
		}
	}
}