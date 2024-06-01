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
				let items = this.actor.items;
				items = coreModule.api.Utils.sortItemsByName(items);
				this.items = items;
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
			//this.#buildWeaponInternals();
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
		 * Build weapons
		 * @private
		 */
		async #buildWeaponInternals() {}

		/**
		 * Build other active internals
		 * @private
		 */
		async #buildActiveInternals() {}

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
