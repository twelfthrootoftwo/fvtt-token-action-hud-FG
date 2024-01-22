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
				nestId: "rolled",
				id: "rolled",
				name: coreModule.api.Utils.i18n("Rolled"),
				groups: [
					{...groups.close, nestId: "rolled_close"},
					{...groups.far, nestId: "rolled_far"},
					{...groups.mental, nestId: "rolled_mental"},
					{...groups.power, nestId: "rolled_power"},
				],
			},
			{
				nestId: "flat",
				id: "flat",
				name: coreModule.api.Utils.i18n("Flat"),
				groups: [{...groups.flat, nestId: "flat_flat"}],
			},
			{
				nestId: "utility",
				id: "utility",
				name: coreModule.api.Utils.i18n("tokenActionHud.utility"),
				groups: [
					{...groups.combat, nestId: "utility_combat"},
					{...groups.token, nestId: "utility_token"},
					{...groups.rests, nestId: "utility_rests"},
					{...groups.utility, nestId: "utility_utility"},
				],
			},
		],
		groups: groupsArray,
	};
});
