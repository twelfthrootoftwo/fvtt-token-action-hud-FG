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
				nestId: "basic",
				id: "basic",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.basic"
				),
				type: "system",
				groups: [
					{
						id: "attribute",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.attribute"
						),
						type: "system",
						nestId: "basic_attribute",
					},
					{
						id: "attacks",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.attacks"
						),
						type: "system",
						nestId: "basic_attacks",
					},
					{
						id: "other",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.other"
						),
						type: "system",
						nestId: "basic_other",
					},
				],
			},
			{
				nestId: "internal",
				id: "internal",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.internal"
				),
				type: "system",
				groups: [
					{
						id: "weapon",
						name: game.i18n.localize("INTERNALS.weapons"),
						type: "system",
						nestId: "internal_weapon",
					},
					{
						id: "active",
						name: game.i18n.localize("INTERNALS.active"),
						type: "system",
						nestId: "internal_active",
					},
					{
						id: "passive",
						name: game.i18n.localize("INTERNALS.passive"),
						type: "system",
						nestId: "internal_passive",
					},
					{
						id: "frame",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.frame"
						),
						type: "system",
						nestId: "internal_frame",
					},
				],
			},
			{
				nestId: "fisher",
				id: "fisher",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.fisher"
				),
				type: "system",
				groups: [
					{
						id: "development",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.development"
						),
						type: "system",
						nestId: "fisher_development",
					},
					{
						id: "maneuver",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.maneuver"
						),
						type: "system",
						nestId: "fisher_maneuver",
					},
					{
						id: "word",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.word"
						),
						type: "system",
						nestId: "fisher_word",
					},
				],
			},
			{
				nestId: "standard",
				id: "standard",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.standard"
				),
				type: "system",
				groups: [
					{
						id: "standard",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.standard"
						),
						type: "system",
						nestId: "standard_standard",
					},
				],
			},
			{
				nestId: "utility",
				id: "utility",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.utility"
				),
				type: "system",
				groups: [
					{
						id: "encounter",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.encounter"
						),
						type: "system",
						nestId: "utility_encounter",
					},
					{
						id: "narrative",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.narrative"
						),
						type: "system",
						nestId: "utility_narrative",
					},
					{
						id: "utility",
						name: game.i18n.localize(
							"tokenActionHud.fathomlessgears.utility"
						),
						type: "system",
						nestId: "utility_utility",
					},
				],
			},
		],
		groups: [
			{
				id: "attribute",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.attribute"
				),
				type: "system",
			},
			{
				id: "weapon",
				name: game.i18n.localize("INTERNALS.weapons"),
				type: "system",
			},
			{
				id: "active",
				name: game.i18n.localize("INTERNALS.active"),
				type: "system",
			},
			{
				id: "passive",
				name: game.i18n.localize("INTERNALS.passive"),
				type: "system",
			},
			{
				id: "utility",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.utility"
				),
				type: "system",
			},
			{
				id: "standard",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.standard"
				),
				type: "system",
			},
		],
	};
});
