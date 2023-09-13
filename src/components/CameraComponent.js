const CameraComponent = function( width, height, focus ) {
	this.width = width;
	this.height = height;
	this.focus = focus;
	this.shakeX = 0;
	this.shakeY = 0;
	this.shaking = false;
}
export default CameraComponent;
