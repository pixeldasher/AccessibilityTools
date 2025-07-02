/** Import Command Invoker API polyfill if necessary. */
(async () => {
	if (!("command" in HTMLButtonElement.prototype)) {
		await import("./commands.js");
	}
})();

const root = document.documentElement;

const detectUserPreferences = () => {
	// Entferne alle existierenden Präferenz-Klassen vor dem Setzen neuer
	root.classList.remove(
		"prefers-reduced-transparency",
		"prefers-dark-scheme",
		"prefers-light-scheme",
		"prefers-reduced-motion",
		"system-contrast-mode-high",
		"system-contrast-mode-low",
		"system-contrast-mode-forced",
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

document.addEventListener("DOMContentLoaded", () => {
	const menuPanel = document.getElementById("accessibility-menu-panel");
	if (!(menuPanel instanceof HTMLElement)) return;

	const toggleButton = document.getElementById("accessibility-menu-toggle");
	if (!(toggleButton instanceof HTMLButtonElement)) return;

	const contrastButton = document.getElementById("contrast-mode");
	if (!(contrastButton instanceof HTMLButtonElement)) return;

	const brightnessSlider = document.getElementById("brightness-slider");
	if (!(brightnessSlider instanceof HTMLInputElement)) return;

	const fontSizeSelect = document.getElementById("font-size-select");
	if (!(fontSizeSelect instanceof HTMLSelectElement)) return;

	const resetSettingsButton = document.getElementById("reset-settings");
	if (!(resetSettingsButton instanceof HTMLButtonElement)) return;

	/**
	 * @typedef {Object} Settings
	 * @property {boolean} highContrast
	 * @property {string} brightness
	 * @property {string} fontSizeLevel
	 */

	// --- Funktionen zum Speichern und Laden der Einstellungen ---
	const saveSettings = () => {
		/** @type {Settings} settings */
		const settings = {
			highContrast: contrastButton.getAttribute("aria-pressed") === "true",
			brightness: brightnessSlider.value,
			fontSizeLevel: fontSizeSelect.value,
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
			document.body.classList.toggle("high-contrast", isHighContrast);

			// Helligkeit
			brightnessSlider.value = String(settings.brightness);
			brightnessSlider.setAttribute(
				"aria-valuetext",
				`${settings.brightness} Prozent`,
			);
			root.style.setProperty(
				"--brightness",
				`${Math.round(Number.parseInt(settings.brightness)) / 100}`,
			);

			// Schriftgröße
			fontSizeSelect.value = settings.fontSizeLevel;
			applyFontSize(Number.parseInt(settings.fontSizeLevel));
		} else {
			// Standardeinstellungen, falls noch nichts gespeichert ist
			contrastButton.setAttribute("aria-pressed", "false");
			document.body.classList.remove("high-contrast");
			brightnessSlider.value = String(50);
			brightnessSlider.setAttribute("aria-valuetext", "50 Prozent");
			root.style.setProperty("--brightness", "0.5"); // Standard Helligkeit
			fontSizeSelect.value = String(4); // Standard Stufe 4 (Faktor 1)
			applyFontSize(4); // Standard Schriftgröße
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
	const applyFontSize = (level) => {
		const factor = calculateFontSizeFactor(level);
		document.body.style.fontSize = `${factor}em`;
	};

	// --- Event Listener ---

	// Menü-Umschalter
	toggleButton.addEventListener("click", () => {
		const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
		toggleButton.setAttribute("aria-expanded", String(!isExpanded));
		menuPanel.hidden = isExpanded;
	});

	// Kontrast-Umschalter (manuelle Einstellung, überschreibt/ergänzt System-Präferenz)
	contrastButton.addEventListener("click", () => {
		const isPressed = contrastButton.getAttribute("aria-pressed") === "true";
		contrastButton.setAttribute("aria-pressed", String(!isPressed));
		document.body.classList.toggle("high-contrast", !isPressed);
		saveSettings();
	});

	// Helligkeits-Schieberegler
	brightnessSlider.addEventListener("input", () => {
		const brightnessValue = brightnessSlider.value;
		brightnessSlider.setAttribute(
			"aria-valuetext",
			`${brightnessValue} Prozent`,
		);
		root.style.setProperty(
			"--brightness",
			`${Number.parseInt(brightnessValue) / 100}`,
		);
		saveSettings();
	});

	// Schriftgrößen-Auswahl
	fontSizeSelect.addEventListener("change", () => {
		const selectedLevel = parseInt(fontSizeSelect.value);
		applyFontSize(selectedLevel);
		saveSettings();
	});

	// Einstellungen zurücksetzen
	resetSettingsButton.addEventListener("click", () => {
		localStorage.removeItem("accessibilitySettings");
		loadSettings();
		alert("Alle Barrierefreiheits-Einstellungen wurden zurückgesetzt.");
	});

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
});
