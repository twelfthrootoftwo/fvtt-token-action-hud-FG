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
			this.#buildFlatAttributes();
		}

		/**
		 * Build attributes
		 * @private
		 */
		async #buildAttributeRolls() {
			const actionTypeId = "rolled";
			const rolledMap = new Map();

			for (const attr in this.actor.system.attributes.rolled) {
				const attribute = this.actor.system.attributes.rolled[attr];
				const attributeMap = new Map();
				for (let i = 1; i < 4; i++) {
					const label = i.toString() + "d6";
					attributeMap.set(label, attr + ":" + label);
				}
				rolledMap.set(attribute.key, attributeMap);
			}

			for (const [attr, attrMap] of rolledMap) {
				const groupId = attr;
				const groupData = {id: groupId, type: "system"};

				const actions = [...attrMap].map(
					([actionLabel, actionData]) => {
						const id = actionData;
						const name = actionLabel;

						const actionTypeName = coreModule.api.Utils.i18n(
							ACTION_TYPE[actionTypeId]
						);
						const listName = `${
							actionTypeName ? `${actionTypeName}: ` : ""
						}${name}`;
						const encodedValue = [actionTypeId, id].join(
							this.delimiter
						);

						return {
							id,
							name,
							listName,
							encodedValue,
						};
					}
				);
				this.addActions(actions, groupData);
			}
		}

		/**
		 * Build non-rolled attributes
		 * @private
		 */
		async #buildFlatAttributes() {
			const groupData = {id: "flat", type: "system"};
			const id = "flat";
			const name = "Flat";
			const listName = coreModule.api.Utils.i18n(ACTION_TYPE[id]);
			const encodedValue = [id, id].join(this.delimiter);
			const tooltip = this.actor.getFlatAttributeString();
			const flatAction = {
				id,
				name,
				listName,
				encodedValue,
				tooltip: tooltip,
			};
			this.addActions([flatAction], groupData);
		}

		/**
		 * Build utilities
		 * @private
		 */
		async #buildUtilities() {}
	};
});
