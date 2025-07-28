/**
 * A simple polyfill for the Command Invoker API
 * @param {Document|ShadowRoot} root
 */
const polyfill = (root = document) => {
	for (const button of root.querySelectorAll("button[commandfor]")) {
		const targetId = button.getAttribute("commandfor");
		if (!targetId) continue;

		const target = root.getElementById(targetId);
		if (!(target instanceof HTMLDialogElement)) continue;

		button.removeAttribute("commandfor");

		const command = button.getAttribute("command") || "toggle";
		button.removeAttribute("command");

		/** Convert kebab-case to camelCase */
		const methodName = command.replace(/-./g, (c) => c[1].toUpperCase());

		button.addEventListener("click", () => {
			const action =
				/** Use it if it's am available method, … */
				typeof target[methodName] === "function"
					? methodName
					: /** … otherwise toggle the dialog */
						target.open
						? "close"
						: "showModal";

			/** Call the respective action on the dialog and update ARIA state */
			target[action].call(target);
		});
	}
};

export { polyfill as init };
