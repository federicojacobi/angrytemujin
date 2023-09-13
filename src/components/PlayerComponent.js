const PlayerComponent = function() {
	this.status = 1 // 1 alive, 0 dead
	this.level = 1;
	this.nextLevel = 1;
	this.exp = 0;
	this.maxUnits = 1;
	this.units = [];
}

export default PlayerComponent;