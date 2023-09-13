export default class AnimationManager {
    constructor() {
        this.animations = {};
    }

    get( key ) {
        return this.animations[ key ];
    }

    add( key, animationConfig ) {
        this.animations[ key ] = animationConfig;
    }
}
