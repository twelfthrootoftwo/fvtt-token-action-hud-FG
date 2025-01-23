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

			const renderable = ["attribute"];

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
			} else {
				await this.#handleCollectiveAction(
					event,
					actionTypeId,
					actionId
				);
			}
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
				case "attribute":
					this.#handleRollAction(event, actor, actionId);
					break;
				case "weapon":
				case "active":
				case "passive":
				case "development":
				case "maneuver":
				case "word":
					this.#handleItem(event, actor, actionId);
					break;
				case "standard":
					this.#handleStandardAction(event, actor, actionId);
				case "utility":
					this.#handleUtils(event, actor, actionId);
					break;
				default:
					console.log(`Action type code not recognised: ${actionTypeId}`)
			}
		}

		/**
		 * Handle roll action
		 * @private
		 * @param {object} event    The event
		 * @param {object} actor    The actor
		 * @param {string} attributeKey The attribute to trigger
		 */
		#handleRollAction(event, actor, attributeKey) {
			game.rollHandler.startRollDialog(actor, attributeKey);
		}

		#handleItem(event, actor, itemId) {
			actor.postItem(itemId);
		}

		#handleUtils(event, actor, actionId) {
			switch(actionId) {
				case "scanThis":
					actor.toggleScan();
					break;
				case "weightTotal":
					this.#handleWeightTotal();
					break;
				case "hitLocation":
					actor.locationHitMessage();
					break;
				case "ballastTokens":
					this.#handleBallastTokens();
					break;
				case "injuryRoll":
					this.#handleInjuryRoll();
					break;
				case "touchRoll":
					this.#handleTouchRoll();
					break;
				case "meltdownRoll":
					this.#handleMeltdownRoll();
					break;
				default:
					console.log(`Util action code not recognised: ${actionId}`)
			}
		}

		#handleStandardAction(event, actor, actionId) {
			switch(actionId) {
				case "scanAction":
					actor.scanTarget();
					break;
				default:
					console.log(`Standard action code not recognised: ${actionId}`)
			}
		}

		async #handleCollectiveAction(event, actionTypeId,actionId) {
			switch(actionId) {
				case "weightTotal":
					this.#handleWeightTotal();
					break;
				case "ballastTokens":
					this.#handleBallastTokens();
					break;
				default:
					console.log(`Collective action code not recognised: ${actionId}`)
			}
		}

		async #handleWeightTotal() {
			game.hudActions?.weightTotal();
		}

		async #handleBallastTokens() {
			game.hudActions?.createBallastTokens();
		}

		async #handleInjuryRoll() {
			game.rollTables?.rollInjury();
		}

		async #handleTouchRoll() {
			game.rollTables?.rollTouch();
		}

		async #handleMeltdownRoll() {
			game.rollTables?.rollMeltdown();
		}
	};
});
