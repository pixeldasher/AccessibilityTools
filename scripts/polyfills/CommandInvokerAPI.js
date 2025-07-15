/**
 * A simple polyfill for the Command Invoker API
 *
 * @param {Document|ShadowRoot} root
 */
const init = (root = document) => {
	for (const button of root.querySelectorAll("button[commandfor]")) {
		const targetId = button.getAttribute("commandfor");
		if (!targetId) continue;

		const target = root.getElementById(targetId);
		if (!target) continue;

		/** Use ARIA attributes for accessibility and clean up custom attributes. */
		button.setAttribute("aria-controls", targetId);
		button.removeAttribute("commandfor");

		const command = button.getAttribute("command") || "toggle";
		button.setAttribute("data-command", command);
		button.removeAttribute("command");

		/**
		 * Updates the `aria-expanded` state on all buttons controlling this target.
		 * @param {string} targetId The ID of the target element.
		 * @param {boolean} isExpanded The new expanded state.
		 */
		const updateAllRelatedButtons = (targetId, isExpanded) => {
			const buttons = document.querySelectorAll(
				`button[aria-controls="${targetId}"]`,
			);

			for (const button of buttons) {
				button.setAttribute("aria-expanded", String(isExpanded));
			}
		};

		if (target instanceof HTMLDialogElement) {
			/** Convert kebab-case to camelCase */
			const methodName = command.replace(/-./g, (c) => c[1].toUpperCase());

			button.addEventListener("click", () => {
				/** Use specific command if it's a valid method, ... */
				const action =
					typeof target[methodName] === "function"
						? methodName
						: /** ... otherwise toggle the dialog. */
							target.open
							? "close"
							: "showModal";

				// Call the respective action on the dialog and update ARIA state
				target[action].call(target);
				updateAllRelatedButtons(targetId, target.open);
			});
		} else {
			/**
			 * @param {boolean?} force
			 */
			const toggle = (force = null) => {
				const currentState = target.dataset.expanded === "true";
				const newState = force ?? !currentState;

				target.dataset.expanded = String(newState);
				updateAllRelatedButtons(targetId, newState);
			};

			const forceState = { show: true, hide: false, close: false }[command];

			button.addEventListener("click", () => toggle(forceState));
		}
	}
};

export { init };
