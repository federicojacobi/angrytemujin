import { BTREE } from "../helpers/Constants";

export default BTComponent = {
	type: BTREE,
	kind: null,
	btree: null,
	runEvery: 5, // Don't run the tree every frame ... do every runEvery instead.
	runAccumulator: 0, // Frames since last BT run.
};
