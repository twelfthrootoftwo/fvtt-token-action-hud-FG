import {ATTRIBUTES} from "./constants.js";

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
				case "encounter":
				case "narrative":
				case "utility":
					this.#handleUtils(event, actor, actionId);
					break;
				case "basic":
					this.#handleBasic(event, actor, actionId);
					break;
				case "basicAttacks":
					this.#handleBasicAttacks(event, actor, actionId);
					break;
				case "frame":
					actor.shareFrameAbility();
					break;
				default:
					console.log(
						`Action type code not recognised: ${actionTypeId}`
					);
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
			switch (actionId) {
				case "scanThis":
					actor.toggleScan();
					break;
				case "weightTotal":
					this.#handleWeightTotal();
					break;
				case "hitLocation":
					actor.locationHitMessage();
					break;
				case "holdAp":
					this.#handleHoldAp(actor);
					break;
				case "ballastTokens":
					this.#handleBallastTokens();
					break;
				case "narrativeRoll":
					this.#handleNarrativeRoll(actor);
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
				case "repairCost":
					this.#handleRepairCost(actor);
					break;
				case "clearAllConditions":
					actor.itemsManager.clearConditions();
					break;
				default:
					console.log(`Util action code not recognised: ${actionId}`);
			}
		}

		#handleBasic(event, actor, actionId) {
			switch (actionId) {
				case "scanAction":
					game.hudActions?.scanTarget(actor);
					break;
				case "slip":
				case "scrub":
				case "transferLine":
					game.hudActions?.textAction(actor, actionId);
					break;
				default:
					console.log(
						`Basic action code not recognised: ${actionId}`
					);
			}
		}

		#handleBasicAttacks(event, actor, actionId) {
			switch (actionId) {
				case "bash":
				case "wrangle":
				case "push":
					game.rollHandler.startRollDialog(
						actor,
						ATTRIBUTES.close,
						null,
						actionId
					);
					break;
				case "intimidate":
				case "threatDisplay":
					game.rollHandler.startRollDialog(
						actor,
						ATTRIBUTES.mental,
						null,
						actionId
					);
					break;
				default:
					console.log(
						`Basic action code not recognised: ${actionId}`
					);
			}
		}

		async #handleCollectiveAction(event, actionTypeId, actionId) {
			switch (actionId) {
				case "weightTotal":
					this.#handleWeightTotal();
					break;
				case "ballastTokens":
					this.#handleBallastTokens();
					break;
				default:
					console.log(
						`Collective action code not recognised: ${actionId}`
					);
			}
		}

		async #handleWeightTotal() {
			game.hudActions?.weightTotal();
		}

		async #handleBallastTokens() {
			game.hudActions?.createBallastTokens();
		}

		async #handleNarrativeRoll(actor) {
			game.hudActions?.rollNarrative(actor);
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

		async #handleRepairCost(actor) {
			game.hudActions?.calculateRepairCost(actor);
		}

		async #handleHoldAp(actor) {
			game.hudActions?.holdAp(actor);
		}
	};
});
