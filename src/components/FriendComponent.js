import { PROTECTOR } from "../helpers/Constants";

const FriendComponent = function( type ) {
	this.level = 1;
	this.type = type ? type : PROTECTOR;
}

export default FriendComponent;