/**
 * Normalize vector.
 *
 * @param {*} vx Vector X
 * @param {*} vy Vector Y
 * @returns 
 */
export function normalizeVector( vx, vy ) {
	const vLength = Math.sqrt( ( vx * vx ) + ( vy * vy ) );

	return {
		x: vx / vLength,
		y: vy / vLength,
	}
}

/**
 * Distance between 2 points.
 *
 * @param {*} v1x 
 * @param {*} v1y 
 * @param {*} v2x 
 * @param {*} v2y 
 */
export function distanceBetweenPoints( v1x, v1y, v2x, v2y ) {
	return Math.sqrt( ( ( v1x - v2x ) ** 2 ) + ( ( v1y - v2y ) ** 2 ) );
}

/**
 * Uses Mulberry32.
 * 
 * @param {int} a Seed.
 *
 * @returns Randomizer function.
 */
export function Random( a ) {
	return function() {
		var t = a += 0x6D2B79F5;
		t = Math.imul( t ^ t >>> 15, t | 1 );
		t ^= t + Math.imul( t ^ t >>> 7, t | 61 );
		return ( ( t ^ t >>> 14 ) >>> 0 ) / 4294967296;
    }
}
