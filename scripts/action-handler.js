// System Module Imports
import {ACTION_TYPE} from "./constants.js";
import {Utils} from "./utils.js";

export let ActionHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
	/**
	 * Extends Token Action HUD Core's ActionHandler class and builds system-defined actions for the HUD
	 */
	ActionHandler = class ActionHandler extends coreModule.api.ActionHandler {
		/**
		 * Build system actions
		 * Called by Token Action HUD Core
		 * @override
		 * @param {array} groupIds
		 */ a;
		async buildSystemActions(groupIds) {
			// Set actor and token variables
			this.actorType = this.actor?.type;

			// Set items variable
			if (this.actor) {
				this.items = this.actor.itemTypes;
				if (this.actorType === "fisher" || this.actorType === "fish") {
					await this.#buildCharacterActions();
				}
			} else {
				this.#buildMultipleTokenActions();
			}
		}

		/**
		 * Build character actions
		 * @private
		 */
		async #buildCharacterActions() {
			switch (this.actorType) {
				case "fisher":
					await this.#buildFisherActions();
					break;
				case "fish":
					this.#buildFishActions();
					break;
			}
			await this.#buildAttributeRolls();
			await this.#buildInternals();
			await this.#buildWords();
		}

		/**
		 * Build attributes
		 * @private
		 */
		async #buildAttributeRolls() {
			const actionTypeId = "attribute";
			const groupData = {
				id: "attribute",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.attribute"
				),
				type: "system",
			};

			// Get actions
			const actions = [];
			for (const attr in this.actor.system.attributes) {
				if (shouldDisplayAttribute(attr)) {
					const id = attr;
					const name = game.i18n.localize(`ATTRIBUTES.${attr}`);
					const encodedValue = [actionTypeId, id].join(
						this.delimiter
					);
					actions.push({
						id,
						name,
						encodedValue,
					});
				}
			}
			this.addActions(actions, groupData);
		}

		/**
		 * Build internals
		 * @private
		 */
		async #buildInternals() {
			const weapons = [];
			const active = [];
			const passive = [];
			const internals = this.items["internal_pc"].concat(
				this.items["internal_npc"]
			);
			internals.forEach((internal) => {
				switch (internal.system.type) {
					case "close":
					case "far":
					case "mental":
						weapons.push(internal);
						break;
					case "active":
						active.push(internal);
						break;
					case "mitigation":
					case "passive":
						passive.push(internal);
						break;
				}
			});

			await this.#buildWeaponInternals(weapons);
			await this.#buildActiveInternals(active);
			await this.#buildPassiveInternals(passive);

			if (this.actorType === "fisher") {
				await this.#buildFrameAbility();
			}
		}

		/**
		 * Build weapons
		 * @private
		 */
		async #buildWeaponInternals(weapons) {
			const actionTypeId = "weapon";
			const groupData = {
				id: "weapon",
				name: game.i18n.localize("INTERNALS.weapons"),
				type: "system",
			};

			// Get actions
			const actions = [];
			weapons.forEach((item) => {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			});
			this.addActions(actions, groupData);
		}

		/**
		 * Build other active internals
		 * @private
		 */
		async #buildActiveInternals(active) {
			const actionTypeId = "active";
			const groupData = {
				id: "active",
				name: game.i18n.localize("INTERNALS.active"),
				type: "system",
			};

			// Get actions
			const actions = [];
			active.forEach((item) => {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			});
			this.addActions(actions, groupData);
		}

		/**
		 * Build passive internals
		 * @private
		 */
		async #buildPassiveInternals(passive) {
			const actionTypeId = "passive";
			const groupData = {
				id: "passive",
				name: game.i18n.localize("INTERNALS.passive"),
				type: "system",
			};

			// Get actions
			const actions = [];
			passive.forEach((item) => {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			});
			this.addActions(actions, groupData);
		}

		async #buildFrameAbility() {
			const actionTypeId = "frame";
			const groupData = {
				id: "frame",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.frame"
				),
				type: "system",
			};

			// Get actions
			const actions = [];
			actions.push(this.constructAction(actionTypeId, "frame"));
			this.addActions(actions, groupData);
		}

		/**
		 * Build other fisher actions
		 * @private
		 */
		async #buildFisherActions() {
			let actionTypeId = "encounter";
			let groupData = {
				id: "encounter",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.encounter"
				),
				type: "system",
			};
			let actions = [];
			let actionIds = [];
			actions.push(this.constructHitLocation(actionTypeId));
			actions.push(
				this.constructAction(actionTypeId, "clearAllConditions")
			);
			actions.push(this.constructAction(actionTypeId, "meltdownRoll"));
			actions.push(this.constructAction(actionTypeId, "holdAp"));
			this.addActions(actions, groupData);

			actionTypeId = "narrative";
			groupData = {
				id: "narrative",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.narrative"
				),
				type: "system",
			};
			actionIds = [
				"narrativeRoll",
				"injuryRoll",
				"touchRoll",
				"repairCost",
			];
			actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);

			if (game.user.isGM) {
				actionTypeId = "utility";
				groupData = {
					id: "utility",
					name: game.i18n.localize(
						"tokenActionHud.fathomlessgears.utility"
					),
					type: "system",
				};
				actionIds = ["ballastTokens"];
				actions = actionIds.map((action) =>
					this.constructAction(actionTypeId, action)
				);
				this.addActions(actions, groupData);
			}

			actionTypeId = "basic";
			groupData = {
				id: "other",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.other"
				),
				type: "system",
			};
			actionIds = ["reelCheck", "scanAction"];
			actionIds = actionIds.concat(["slip", "scrub", "transferLine"]);
			actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);

			actionTypeId = "basicAttacks";
			groupData = {
				id: "attacks",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.attacks"
				),
				type: "system",
			};
			actionIds = ["bash"];
			actionIds = actionIds.concat(["wrangle", "push", "intimidate"]);
			actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);

			await this.#buildDevelopments();
			await this.#buildManeuvers();
		}

		async #buildDevelopments() {
			let actionTypeId = "development";
			let groupData = {
				id: "development",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.development"
				),
				type: "system",
			};
			let actions = [];
			for (let item of this.items["development"]) {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if (actions.length > 0) this.addActions(actions, groupData);
		}

		async #buildManeuvers() {
			let actionTypeId = "maneuver";
			let groupData = {
				id: "maneuver",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.maneuver"
				),
				type: "system",
			};
			let actions = [];
			for (let item of this.items["maneuver"]) {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if (actions.length > 0) this.addActions(actions, groupData);
		}

		/**
		 * Build other fish actions
		 * @private
		 */
		async #buildFishActions() {
			let actionTypeId = "encounter";
			let groupData = {
				id: "encounter",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.encounter"
				),
				type: "system",
			};
			let actionIds = ["scanThis", "clearAllConditions"];
			let actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			actions.push(this.constructHitLocation(actionTypeId));
			actions.push(this.constructAction(actionTypeId, "holdAp"));
			this.addActions(actions, groupData);

			actionTypeId = "utility";
			groupData = {
				id: "utility",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.utility"
				),
				type: "system",
			};
			actionIds = ["weightTotal", "ballastTokens"];
			actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);

			actionTypeId = "basicAttacks";
			groupData = {
				id: "attacks",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.attacks"
				),
				type: "system",
			};
			actionIds = ["reelCheck", "bash", "threatDisplay"];
			actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);
		}

		/**
		 * Build collective actions
		 * @private
		 */
		async #buildMultipleTokenActions() {
			let actionTypeId = "utility";
			let groupData = {
				id: "utility",
				name: game.i18n.localize(
					"tokenActionHud.fathomlessgears.utility"
				),
				type: "system",
			};
			let actionIds = ["weightTotal", "ballastTokens"];
			let actions = actionIds.map((action) =>
				this.constructAction(actionTypeId, action)
			);
			this.addActions(actions, groupData);
		}

		async #buildWords() {
			let actionTypeId = "word";
			let groupData = {
				id: "word",
				name: game.i18n.localize("tokenActionHud.fathomlessgears.word"),
				type: "system",
			};
			let actions = [];
			for (let item of this.items["deep_word"]) {
				const id = item._id;
				const name = item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if (actions.length > 0) this.addActions(actions, groupData);
		}

		constructHitLocation(actionTypeId) {
			let id = "hitLocation";
			let name = game.i18n.localize("SHEET.hitLocation");
			let encodedValue = [actionTypeId, id].join(this.delimiter);

			return {id, name, encodedValue};
		}

		constructAction(actionTypeId, id) {
			let name = game.i18n.localize(
				`tokenActionHud.fathomlessgears.${id}`
			);
			let encodedValue = [actionTypeId, id].join(this.delimiter);

			return {id, name, encodedValue};
		}
	};
});

function shouldDisplayAttribute(attr) {
	const toDisplay = ["close", "far", "mental", "power"];
	return toDisplay.includes(attr);
}
