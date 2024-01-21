// System Module Imports
import {ACTION_TYPE} from "./constants.js";
import {Utils} from "./utils.js";

export let ActionHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
	console.log("Init");
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

			// Settings
			this.displayUnequipped = Utils.getSetting("displayUnequipped");

			// Set items variable
			if (this.actor) {
				let items = this.actor.items;
				items = coreModule.api.Utils.sortItemsByName(items);
				this.items = items;
			}

			if (this.actorType === "fisher" || this.actorType === "fish") {
				this.#buildCharacterActions();
			} else if (!this.actor) {
				//Not supported
				//this.#buildMultipleTokenActions()
				console.log(
					"Token Action HUD not supported for multiple tokens"
				);
			}
		}

		/**
		 * Build character actions
		 * @private
		 */
		#buildCharacterActions() {
			this.#buildAttributeRolls();
		}

		/**
		 * Build attributes
		 * @private
		 */
		async #buildAttributeRolls() {
			const actionTypeId = "rolled";
			const groupData = {id: "rolled", type: "system"};
			const actions = [];
			for (const attribute in this.actor.system.attributes.rolled) {
				const attr = this.actor.system.attributes.rolled[attribute];
				const id = attr.key;
				const name = attr.label;
				const actionTypeName = coreModule.api.Utils.i18n(
					ACTION_TYPE[actionTypeId]
				);
				const listName = `${
					actionTypeName ? `${actionTypeName}: ` : ""
				}${name}`;
				const encodedValue = [actionTypeId, id].join(this.delimiter);

				actions.push({
					id,
					name,
					listName,
					encodedValue,
				});
			}
			this.addActions(actions, groupData);
		}
	};
});
