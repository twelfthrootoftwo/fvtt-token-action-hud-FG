import {GROUP} from "./constants.js";

/**
 * Default layout and groups
 */
export let DEFAULTS = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
	const groups = GROUP;
	Object.values(groups).forEach((group) => {
		group.name = coreModule.api.Utils.i18n(group.name);
		group.listName = `Group: ${coreModule.api.Utils.i18n(
			group.listName ?? group.name
		)}`;
	});
	const groupsArray = Object.values(groups);
	DEFAULTS = {
		layout: [
			{
				nestId: "attribute",
				id: "attribute",
				name: "Attributes",
				type: "system",
				groups: [
					{id: "attribute", name: "Attributes", type: "system",nestId: "attribute_attribute"}
				]
			}
		],
		groups: [
			{id: "attribute", name: "Attributes", type: "system"}
		],
	};
});
