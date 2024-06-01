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
				name: game.i18n.localize("tokenActionHud.hooklineandmecha.attribute"),
				type: "system",
				groups: [
					{id: "attribute", name: game.i18n.localize("tokenActionHud.hooklineandmecha.attribute"), type: "system",nestId: "attribute_attribute"}
				]
			},
			{
				nestId: "internal",
				id: "internal",
				name: game.i18n.localize("tokenActionHud.hooklineandmecha.internal"),
				type: "system",
				groups: [
					{id: "weapon", name: game.i18n.localize("INTERNALS.weapons"), type: "system",nestId: "internal_weapon"},
					{id: "active", name: game.i18n.localize("INTERNALS.active"), type: "system",nestId: "internal_active"},
					{id: "passive", name: game.i18n.localize("INTERNALS.passive"), type: "system",nestId: "internal_passive"}
				]
			},
			{
				nestId: "utility",
				id: "utility",
				name: game.i18n.localize("tokenActionHud.hooklineandmecha.utility"),
				type: "system",
				groups: [
					{id: "utility", name: game.i18n.localize("tokenActionHud.hooklineandmecha.utility"), type: "system", nestId: "utility_utility"}
				]
			},
		],
		groups: [
			{id: "attribute", name: game.i18n.localize("tokenActionHud.hooklineandmecha.attribute"), type: "system"},
			{id: "weapon", name: game.i18n.localize("INTERNALS.weapons"), type: "system"},
			{id: "active", name: game.i18n.localize("INTERNALS.active"), type: "system"},
			{id: "passive", name: game.i18n.localize("INTERNALS.passive"), type: "system"},
			{id: "utility", name: game.i18n.localize("tokenActionHud.hooklineandmecha.utility"), type: "system"}
		],
	};
});
