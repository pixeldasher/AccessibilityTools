const main = () => {
	// Try native console.log if it's available
	if (
		window.console &&
		typeof window.console.log === "function" &&
		window.console.log.toString().includes("[native code]")
	) {
		window.console.log("hi from main (via window.console)");
	} else {
		console.log("hi from main (via overridden console)"); // This won't show if overridden
	}
};

document.addEventListener("DOMContentLoaded", main);

if (
	window.console &&
	typeof window.console.log === "function" &&
	window.console.log.toString().includes("[native code]")
) {
	window.console.log("hi (via window.console)");
} else {
	console.log("hi (via overridden console)");
}

(() => {
	if (
		window.console &&
		typeof window.console.log === "function" &&
		window.console.log.toString().includes("[native code]")
	) {
		window.console.log("hi IIFE (via window.console)");
	} else {
		console.log("hi IIFE (via overridden console)");
	}
})();
