/**
 * A simple polyfill for Declarative Shadow DOM.
 *
 * @param {Document|ShadowRoot} root
 */
const attachShadowRoots = (root = document) => {
	/** @type {NodeListOf<HTMLTemplateElement>} */
	const templates = root.querySelectorAll("template[shadowrootmode]");

	for (const template of templates) {
		const host = template.parentElement;
		if (!host) continue;

		const mode = template.getAttribute("shadowrootmode");
		if (!(mode === "open" || mode === "closed")) continue;

		try {
			const shadowRoot = host.attachShadow({ mode });

			/** Move content of template into the shadow root */
			shadowRoot.append(template.content.cloneNode(true));
			template.remove();

			/** Recursively apply to the newly created shadow root */
			attachShadowRoots(shadowRoot);
		} catch (error) {
			console.error("Error attaching shadow root:", error);
		}
	}
};

const init = () => {
	/** Initial invocation */
	attachShadowRoots();
}

export { init };
