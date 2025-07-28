class AccessibilityTools extends HTMLElement {
	async connectedCallback() {
		await this.initializePolyfills();
	}

	async initializePolyfills() {
		if (!Object.hasOwn(HTMLTemplateElement.prototype, "shadowRootMode")) {
			const { init } = await import("./polyfills/DeclarativeShadowDOM.js");

			init();
		}

		if (!this.shadowRoot) return;

		if (!Object.hasOwn(HTMLButtonElement.prototype, "command")) {
			const { init } = await import("./polyfills/CommandInvokerAPI.js");

			init(this.shadowRoot);
		}
	}
}

window.customElements.define("accessibility-tools", AccessibilityTools);

const root = document.documentElement;

const detectUserPreferences = () => {
	// Reset all classes
	root.classList.remove(
		/** */
		"high-contrast",
	);

	// prefers-reduced-transparency
	if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) {
		root.classList.add("prefers-reduced-transparency");
		console.log("Nutzer bevorzugt reduzierte Transparenz.");
	}

	// prefers-color-scheme
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		root.classList.add("prefers-dark-scheme");
		console.log("Nutzer bevorzugt dunkles Farbschema.");
	} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
		root.classList.add("prefers-light-scheme");
		console.log("Nutzer bevorzugt helles Farbschema.");
	}

	// prefers-reduced-motion
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		root.classList.add("prefers-reduced-motion");
		console.log("Nutzer bevorzugt reduzierte Animationen.");
	}

	// Kombinierte Kontrast-Erkennung: forced-colors hat Vorrang
	if (window.matchMedia("(forced-colors: active)").matches) {
		root.classList.add("system-contrast-mode-forced");
		console.log(
			"Erzwungene Farben sind aktiv (z.B. Windows High Contrast Mode).",
		);
	} else if (window.matchMedia("(prefers-contrast: high)").matches) {
		root.classList.add("system-contrast-mode-high");
		console.log("Nutzer bevorzugt hohen Kontrast (Systemeinstellung).");
	} else if (window.matchMedia("(prefers-contrast: less)").matches) {
		root.classList.add("system-contrast-mode-low");
		console.log("Nutzer bevorzugt geringeren Kontrast (Systemeinstellung).");
	}
};

document.addEventListener(
	"DOMContentLoaded",
	() => {
		const accessibilityTools = document
			.getElementsByTagName("accessibility-tools")
			.item(0);
		if (!(accessibilityTools instanceof AccessibilityTools)) return;

		const shadowRoot = accessibilityTools.shadowRoot;
		if (!shadowRoot) return;

		const dialog = shadowRoot.getElementById("accessibility-tools");
		if (!(dialog instanceof HTMLDialogElement)) return;

		const toggleButton = shadowRoot.getElementById(
			"accessibility-tools-toggle",
		);
		if (!(toggleButton instanceof HTMLButtonElement)) return;

		const contrastButton = shadowRoot.getElementById("contrast-toggle");
		if (!(contrastButton instanceof HTMLButtonElement)) return;

		const fontSizeIncrease = shadowRoot.getElementById("font-size-increase");
		if (!(fontSizeIncrease instanceof HTMLButtonElement)) return;

		const fontSizeReset = shadowRoot.getElementById("font-size-reset");
		if (!(fontSizeReset instanceof HTMLButtonElement)) return;

		const fontSizeDecrease = shadowRoot.getElementById("font-size-decrease");
		if (!(fontSizeDecrease instanceof HTMLButtonElement)) return;

		const resetSettingsButton = shadowRoot.getElementById("settings-reset");
		if (!(resetSettingsButton instanceof HTMLButtonElement)) return;

		document.addEventListener(
			"keydown",
			(event) => {
				/** Only listen if the dialog is not open */
				if (dialog.open) return;

				/** Listen for key press of "a" key */
				if (event.key.toLocaleLowerCase() !== "a") return;

				/** Stop if user might try to run a command */
				if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey)
					return;

				toggleButton.focus({ preventScroll: true });
			},
			{ passive: true },
		);

		/**
		 * @typedef {Object} Settings
		 * @property {boolean} highContrast
		 */

		// --- Funktionen zum Speichern und Laden der Einstellungen ---
		const saveSettings = () => {
			/** @type {Settings} settings */
			const settings = {
				highContrast: contrastButton.getAttribute("aria-pressed") === "true",
			};
			localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
		};

		const loadSettings = () => {
			const savedSettings = localStorage.getItem("accessibilitySettings");
			if (savedSettings) {
				/** @type {Settings} settings */
				const settings = JSON.parse(savedSettings);

				// Kontrast
				const isHighContrast = settings.highContrast;
				contrastButton.setAttribute("aria-pressed", String(isHighContrast));
				root.classList.toggle("high-contrast", isHighContrast);
			} else {
				// Standardeinstellungen, falls noch nichts gespeichert ist
				contrastButton.setAttribute("aria-pressed", "false");
				root.classList.remove("high-contrast");
			}
		};

		/**
		 * Berechnet den Schriftgrößenfaktor basierend auf der Stufe (1-7).
		 * Stufe 1 = 0.5, Stufe 4 = 1, Stufe 7 = 2.
		 * Nutzt eine lineare Interpolation.
		 * @param {number} level - Die Schriftgrößenstufe von 1 bis 7.
		 * @returns {number} Der Skalierungsfaktor für die Schriftgröße.
		 */
		const calculateFontSizeFactor = (level) => {
			if (level >= 1 && level <= 4) {
				return 0.5 + (1 / 6) * (level - 1);
			} else if (level > 4 && level <= 7) {
				return 1 + (1 / 3) * (level - 4);
			} else {
				console.warn(
					`Ungültige Schriftgrößenstufe: ${level}. Verwende Standardwert (1).`,
				);
				return 1;
			}
		};

		/**
		 * Wendet die berechnete Schriftgröße auf den body an.
		 * @param {number} level - Die Schriftgrößenstufe von 1 bis 7.
		 */
		const _applyFontSize = (level) => {
			const factor = calculateFontSizeFactor(level);
			document.body.style.fontSize = `${factor}em`;
		};

		// --- Event Listener ---

		// Kontrast-Umschalter (manuelle Einstellung, überschreibt/ergänzt System-Präferenz)
		contrastButton.addEventListener(
			"click",
			() => {
				const isPressed =
					contrastButton.getAttribute("aria-pressed") === "true";
				contrastButton.setAttribute("aria-pressed", String(!isPressed));
				root.classList.toggle("high-contrast", !isPressed);
				saveSettings();
			},
			{ passive: true },
		);

		// Einstellungen zurücksetzen
		resetSettingsButton.addEventListener(
			"click",
			() => {
				localStorage.removeItem("accessibilitySettings");
				loadSettings();
				alert("Alle Barrierefreiheits-Einstellungen wurden zurückgesetzt.");
			},
			{ passive: true },
		);

		// Initialize settings
		detectUserPreferences();
		loadSettings();

		// Listen for changes in user preferences
		const preferences = [
			"prefers-reduced-transparency",
			"prefers-contrast",
			"prefers-color-scheme",
			"prefers-reduced-motion",
			"forced-colors",
		];
		for (const preference of preferences) {
			window
				.matchMedia(`(${preference})`)
				.addEventListener("change", detectUserPreferences);
		}
	},
	{ once: true, passive: true },
);
