export let RollHandler = null;

Hooks.once("tokenActionHudCoreApiReady", async (coreModule) => {
	/**
	 * Extends Token Action HUD Core's RollHandler class and handles action events triggered when an action is clicked
	 */
	RollHandler = class RollHandler extends coreModule.api.RollHandler {
		/**
		 * Handle action click
		 * Called by Token Action HUD Core when an action is left or right-clicked
		 * @override
		 * @param {object} event        The event
		 * @param {string} encodedValue The encoded value
		 */
		async handleActionClick(event, encodedValue) {
			const payload = encodedValue.split("|");

			if (payload.length < 2) {
				super.throwInvalidValueErr();
			}

			const actionTypeId = payload[0];
			const actionId = payload[1];

			const renderable = ["attributeRolls"];

			if (renderable.includes(actionTypeId) && this.isRenderItem()) {
				return this.doRenderItem(this.actor, actionId);
			}

			const knownCharacters = ["fisher", "fish"];

			// If single actor is selected
			if (this.actor) {
				await this.#handleAction(
					event,
					this.actor,
					this.token,
					actionTypeId,
					actionId
				);
				return;
			}

			//Multiple actors not supported
		}

		/**
		 * Handle action hover
		 * Called by Token Action HUD Core when an action is hovered on or off
		 * @override
		 * @param {object} event        The event
		 * @param {string} encodedValue The encoded value
		 */
		async handleActionHover(event, encodedValue) {
			//TODO: Show flat attributes
		}

		/**
		 * Handle action
		 * @private
		 * @param {object} event        The event
		 * @param {object} actor        The actor
		 * @param {object} token        The token
		 * @param {string} actionTypeId The action type id
		 * @param {string} actionId     The actionId
		 */
		async #handleAction(event, actor, token, actionTypeId, actionId) {
			switch (actionTypeId) {
				case "attributeRolls":
					this.#handleRollAction(event, actor, actionId);
					break;
			}
		}

		/**
		 * Handle item action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} actionId The action id
		 */
		#handleRollAction(event, actor, actionId) {
			//TODO: make this an actual function
			console.log(actionId);
			//actor.roll()
		}
	};
});
