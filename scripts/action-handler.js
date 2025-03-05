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
			switch(this.actorType) {
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
			const groupData = { id: "attribute", name: game.i18n.localize('tokenActionHud.fathomlessgears.attribute'), type: "system" };
			
			// Get actions
			const actions = [];
			for (const attr in this.actor.system.attributes) {
				if (shouldDisplayAttribute(attr)) {
					const id = attr;
					const name=game.i18n.localize(`ATTRIBUTES.${attr}`);
					const encodedValue = [actionTypeId, id].join(this.delimiter);
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
			const weapons=[];
			const active=[];
			const passive=[];
			const internals=this.items["internal_pc"].concat(this.items["internal_npc"]);
			internals.forEach((internal) => {
				switch(internal.system.type) {
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
			})

			await this.#buildWeaponInternals(weapons);
			await this.#buildActiveInternals(active);
			await this.#buildPassiveInternals(passive);
		}

		/**
		 * Build weapons
		 * @private
		 */
		async #buildWeaponInternals(weapons) {
			const actionTypeId = "weapon";
			const groupData = { id: "weapon", name: game.i18n.localize('INTERNALS.weapons'), type: "system" };
			
			// Get actions
			const actions = [];
			weapons.forEach((item) => {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			this.addActions(actions, groupData);
		}

		/**
		 * Build other active internals
		 * @private
		 */
		async #buildActiveInternals(active) {
			const actionTypeId = "active";
			const groupData = { id: "active", name: game.i18n.localize('INTERNALS.active'), type: "system" };
			
			// Get actions
			const actions = [];
			active.forEach((item) => {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			this.addActions(actions, groupData);
		}

		/**
		 * Build passive internals
		 * @private
		 */
		async #buildPassiveInternals(passive) {
			const actionTypeId = "passive";
			const groupData = { id: "passive", name: game.i18n.localize('INTERNALS.passive'), type: "system" };
			
			// Get actions
			const actions = [];
			passive.forEach((item) => {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			this.addActions(actions, groupData);
		}

		/**
		 * Build other fisher actions
		 * @private
		 */
		async #buildFisherActions() {
			let actionTypeId = "utility";
			let groupData = { id: "utility", name: game.i18n.localize("tokenActionHud.fathomlessgears.utility"), type: "system" };
			let actions=[];
			actions.push(this.constructHitLocation(actionTypeId));
			if(game.sensitiveDataAvailable) {
				actions.push(this.constructInjuryRoll(actionTypeId));
				actions.push(this.constructTouchOfTheDeep(actionTypeId));
				actions.push(this.constructMeltdown(actionTypeId));
			}
			if (game.user.isGM) {
				actions.push(this.constructBallastTokens(actionTypeId));
			}
			this.addActions(actions, groupData);

			actionTypeId = "standard";
			groupData = { id: "standard", name: game.i18n.localize("tokenActionHud.fathomlessgears.standard"), type: "system" };
			actions=[];
			actions.push(this.constructScanAction(actionTypeId));
			this.addActions(actions, groupData);

			await this.#buildDevelopments();
			await this.#buildManeuvers();
		}

		async #buildDevelopments() {
			let actionTypeId = "development";
			let groupData = { id: "development", name: game.i18n.localize("tokenActionHud.fathomlessgears.development"), type: "system" };
			let actions=[];
			for(let item of this.items["development"]) {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if(actions.length>0) this.addActions(actions, groupData);
		}

		async #buildManeuvers() {
			let actionTypeId = "maneuver";
			let groupData = { id: "maneuver", name: game.i18n.localize("tokenActionHud.fathomlessgears.maneuver"), type: "system" };
			let actions=[];
			for(let item of this.items["maneuver"]) {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if(actions.length>0) this.addActions(actions, groupData);
		}

		/**
		 * Build other fish actions
		 * @private
		 */
		async #buildFishActions() {
			let actionTypeId = "utility";
			let groupData = { id: "utility", name: game.i18n.localize("tokenActionHud.fathomlessgears.utility"), type: "system" };

			let actions=[];
			actions.push(this.constructScan(actionTypeId));
			actions.push(this.constructHitLocation(actionTypeId));
			actions.push(this.constructWeightTotal(actionTypeId));
			actions.push(this.constructBallastTokens(actionTypeId));
			this.addActions(actions, groupData);
		}

		/**
		 * Build collective actions
		 * @private
		 */
		async #buildMultipleTokenActions() {
			const actionTypeId = "utility";
			const groupData = { id: "utility", name: game.i18n.localize("tokenActionHud.fathomlessgears.utility"), type: "system" };

			let actions=[];
			actions.push(this.constructWeightTotal(actionTypeId));
			actions.push(this.constructBallastTokens(actionTypeId));
			this.addActions(actions, groupData);
		}

		async #buildWords() {
			let actionTypeId = "word";
			let groupData = { id: "word", name: game.i18n.localize("tokenActionHud.fathomlessgears.word"), type: "system" };
			let actions=[];
			for(let item of this.items["deep_word"]) {
				const id=item._id;
				const name=item.name;
				const encodedValue = [actionTypeId, id].join(this.delimiter);
				actions.push({
					id,
					name,
					encodedValue,
				});
			}
			if(actions.length>0) this.addActions(actions, groupData);
		}

		constructScan(actionTypeId) {
			const id="scanThis"
			//const name=await this.actor.getScanText();
			const name=game.i18n.localize("tokenActionHud.fathomlessgears.scanThis");
			const encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}
		
		constructWeightTotal(actionTypeId) {
			let id="weightTotal"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.weightTotal");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructHitLocation(actionTypeId) {
			let id="hitLocation"
			let name=game.i18n.localize("SHEET.hitlocation");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructScanAction(actionTypeId) {
			let id="scanAction"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.scanAction");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructBallastTokens(actionTypeId) {
			let id="ballastTokens"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.ballastTokens");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructInjuryRoll(actionTypeId) {
			let id="injuryRoll"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.injuryRoll");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructTouchOfTheDeep(actionTypeId) {
			let id="touchRoll"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.touchRoll");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}

		constructMeltdown(actionTypeId) {
			let id="meltdownRoll"
			let name=game.i18n.localize("tokenActionHud.fathomlessgears.meltdownRoll");
			let encodedValue = [actionTypeId, id].join(this.delimiter);
		
			return {id, name, encodedValue}
		}
	};
});

function shouldDisplayAttribute(attr) {
	const toDisplay=["close","far","mental","power"];
	return toDisplay.includes(attr);
}

