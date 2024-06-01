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
			this.actors = !this.actor ? this._getActors() : [this.actor];
			this.actorType = this.actor?.type;

			// Set items variable
			if (this.actor) {
				this.items = this.actor.itemTypes;
			}

			if (this.actorType === "fisher" || this.actorType === "fish") {
				this.#buildCharacterActions();
			} else if (!this.actor) {
				this.#buildMultipleTokenActions();
			}
		}

		/**
		 * Build character actions
		 * @private
		 */
		#buildCharacterActions() {
			// switch(this.actorType) {
			// 	case "fisher":
			// 		this.#buildFisherActions();
			// 		break;
			// 	case "fish":
			// 		this.#buildFishActions();
			// 		break;
			// }
			this.#buildAttributeRolls();
			this.#buildInternals();
			//this.#buildActiveInternals();
		}

		/**
		 * Build attributes
		 * @private
		 */
		async #buildAttributeRolls() {
			const actionTypeId = "attribute";
			const groupData = { id: "attribute", name: game.i18n.localize('tokenActionHud.hooklineandmecha.attribute'), type: "system" };
			
			// Get actions
			const actions = [];
			for (const attr in this.actor.system.attributes) {
				if (shouldDisplayAttribute(attr)) {
					const id = attr;
					const name=game.i18n.localize(`ATTRIBUTES.${attr}`);
					const encodedValue = [actionTypeId, id].join(this.delimiter);
					console.log(encodedValue);
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
					case "melee":
					case "ranged":
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

			this.#buildWeaponInternals(weapons);
			this.#buildActiveInternals(active);
			this.#buildPassiveInternals(passive);
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
				console.log(encodedValue);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			console.log(actions);
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
				console.log(encodedValue);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			console.log(actions);
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
				console.log(encodedValue);
				actions.push({
					id,
					name,
					encodedValue,
				});
			})
			console.log(actions);
			this.addActions(actions, groupData);
		}

		/**
		 * Build other fisher actions
		 * @private
		 */
		async #buildFisherActions() {}

		/**
		 * Build other fish actions
		 * @private
		 */
		async #buildFishActions() {}

		/**
		 * Build other fish actions
		 * @private
		 */
		async #buildMultipleTokenActions() {}
	};
});

function shouldDisplayAttribute(attr) {
	const toDisplay=["close","far","mental","power"];
	return toDisplay.includes(attr);
}
