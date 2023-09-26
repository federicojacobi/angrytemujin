import { Entity } from "../includes/Entity";

/**
 * 
 * @param {*} rotationSpeed How fast to turn in radians.
 * @param {*} distanceFromCenter How far from the <target> the entity will be.
 * @param {Entity} target Entity to spin around.
 */
const CirclesWeaponComponent = function( rotationSpeed, distanceFromCenter, target ) {
	this.rotationSpeed = rotationSpeed;
	this.distance = distanceFromCenter;
	this.accumulator = 0;
	this.target = target;
}
export default CirclesWeaponComponent;