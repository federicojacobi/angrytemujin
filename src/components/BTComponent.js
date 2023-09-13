const BTComponent = function( type ) {
	this.type = type;
	this.btree = null;
	this.runEvery = 5; // Don't run the tree every frame ... do every runEvery instead.
	this.runAccumulator = 0; // Frames since last BT run.
};

export default BTComponent;
