<?php

declare(strict_types=1);

namespace Hochwarth;

use ProcessWire\WireFileTools;

use function ProcessWire\__;

/**
 * @var WireFileTools $files
 * @var Config $config
 * @var AccessibilityTools $module
 */
$url = $config->urls($module);
$path = $config->paths($module);

?>

<accessibility-tools>
	<template shadowrootmode="open">
		<link rel="stylesheet" nonce="proxy" href="<?= $url ?>styles/main.css">
		<script type="module" nonce="proxy" src="<?= $url ?>scripts/main.js"></script>

		<nav aria-label="<?= __('Inhalte zur Barrierefreiheit', 'AccessibilityTools'); ?>">
			<button
				type="button"
				id="accessibility-tools-toggle"
				commandfor="accessibility-tools"
				command="show-modal"
				title="<?= __('Optionsfenster anzeigen', 'AccessibilityTools'); ?>">
				<span aria-hidden="true">
					<?= $files->fileGetContents("{$path}assets/accessibility.svg") ?>
				</span>
			</button>

			<dialog
				id="accessibility-tools"
				aria-labelledby="accessibility-tools-headline">
				<header class="a11y-dialog-header">
					<h2 id="accessibility-tools-headline">
						<?= __('Optionen zur Barrierefreiheit', 'AccessibilityTools'); ?>
					</h2>

					<form
						method="dialog"
						aria-label="<?= __('Aktionen', 'AccessibilityTools'); ?>">
						<button
							type="submit"
							title="<?= __('Optionsfenster ausblenden', 'AccessibilityTools'); ?>">
							<span aria-hidden="true">
								<?= $files->fileGetContents("{$path}assets/x-lg.svg") ?>
							</span>
						</button>
					</form>
				</header>

				<?php if (!empty($enableContrastMode)): ?>
					<section aria-labelledby="accessibility-tools-contrast-heading">
						<header>
							<h3 id="accessibility-tools-contrast-heading">
								<?= __('Kontrast', 'AccessibilityTools'); ?>
							</h3>
						</header>

						<button
							type="button"
							id="contrast-toggle"
							aria-pressed="false">
							<span role="img" aria-hidden="true">
								<?= $files->fileGetContents("{$path}assets/circle-half.svg") ?>
							</span>
							<span><?= __('Kontrast umschalten', 'AccessibilityTools'); ?></span>
						</button>
					</section>
				<?php endif; ?>
				<?php if (!empty($enableFontSizeAdjust)): ?>

					<section aria-labelledby="accessibility-tools-fontsize-heading">
						<header>
							<h3 id="accessibility-tools-fontsize-heading">
								<?= __('Schriftgröße', 'AccessibilityTools'); ?>
							</h3>
						</header>

						<ul role="list" aria-label="Schrifteinstellungen">
							<li>
								<button
									type="button"
									id="font-size-increase"
									title="<?= __('Schriftgröße erhöhen', 'AccessibilityTools'); ?>">
									<span role="img" aria-hidden="true">
										<?= $files->fileGetContents("{$path}assets/plus-circle-dotted.svg") ?>
									</span>
									<span><?= __('Erhöhen', 'AccessibilityTools'); ?></span>
								</button>
							</li>
							<li>
								<button
									type="button"
									id="font-size-reset"
									title="<?= __('Schriftgröße zurücksetzen', 'AccessibilityTools'); ?>">
									<span role="img" aria-hidden="true">
										<?= $files->fileGetContents("{$path}assets/arrow-counterclockwise.svg") ?>
									</span>
									<span><?= __('Zurücksetzen', 'AccessibilityTools'); ?></span>
								</button>
							</li>
							<li>
								<button
									type="button"
									id="font-size-decrease"
									title="<?= __('Schriftgröße verringern', 'AccessibilityTools'); ?>">
									<span role="img" aria-hidden="true">
										<?= $files->fileGetContents("{$path}assets/dash-circle-dotted.svg") ?>
									</span>
									<span><?= __('Verringern', 'AccessibilityTools'); ?></span>
								</button>
							</li>
						</ul>

						<input type="hidden" id="font-size-value" name="font-size-value" value="4">
					</section>
				<?php endif; ?>

				<footer>
					<?php if (!empty("{$easyLanguageUrl}{$signLanguageUrl}{$accessibilityStatementUrl}")): ?>
						<nav aria-labelledby="accessibility-tools-footer-headline">
							<h3 id="accessibility-tools-footer-headline">
								<?= __('Weitere Inhalte', 'AccessibilityTools'); ?>
							</h3>

							<ul role="list">
								<?php if (!empty($easyLanguageUrl)): ?>
									<li>
										<a href="<?= $easyLanguageUrl; ?>">
											Einfacher Sprache
										</a>
									</li>
								<?php endif; ?>
								<?php if (!empty($signLanguageUrl)): ?>
									<li>
										<a href="<?= $signLanguageUrl; ?>">
											Inhalte in Gebärdensprache
										</a>
									</li>
								<?php endif; ?>
								<?php if (!empty($accessibilityStatementUrl)): ?>
									<li>
										<a href="<?= $accessibilityStatementUrl; ?>">
											Erklärung zur Barrierefreiheit
										</a>
									</li>
								<?php endif; ?>
							</ul>
						</nav>
						<hr>
					<?php endif; ?>

					<button
						type="button"
						class="unobtrusive"
						id="settings-reset"
						title="<?= __('Einstellungen zurücksetzen', 'AccessibilityTools'); ?>">
						<span role="img" aria-hidden="true">
							<?= $files->fileGetContents("{$path}assets/arrow-counterclockwise.svg") ?>
						</span>
						<span>Einstellungen zurücksetzen</span>
					</button>
				</footer>
			</dialog>
		</nav>
	</template>
</accessibility-tools>
