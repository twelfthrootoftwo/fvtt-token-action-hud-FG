/**
 * Module-based constants
 */
export const MODULE = {
	ID: "token-action-hud-FG",
};

/**
 * Core module
 */
export const CORE_MODULE = {
	ID: "token-action-hud-core",
};

/**
 * Core module version required by the system module
 */
export const REQUIRED_CORE_MODULE_VERSION = "1.5";

/**
 * Action types
 */
export const ACTION_TYPE = {
	attribute: "tokenActionHud.attribute",
	weapon: "tokenActionHud.weapon",
	active: "tokenActionHud.active",
	development: "tokenActionHud.development",
};

/**
 * Groups
 */
export const GROUP = {
	attribute: {
		id: "attribute",
		name: "tokenActionHud.active",
		type: "system",
	},
	weapon: {
		id: "weapon",
		name: "tokenActionHud.weapon",
		type: "system",
	},
	active: {
		id: "active",
		name: "tokenActionHud.active",
		type: "system",
	},
	development: {
		id: "development",
		name: "tokenActionHud.development",
		type: "system",
	},
	maneuver: {
		id: "maneuver",
		name: "tokenActionHud.maneuver",
		type: "system",
	},
	word: {
		id: "word",
		name: "tokenActionHud.word",
		type: "system",
	},
	utils: {
		id: "utils",
		name: "tokenActionHud.util",
		type: "system",
	},
};
