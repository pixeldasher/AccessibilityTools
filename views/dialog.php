<?php

declare(strict_types=1);

namespace Hochwarth;

use function ProcessWire\__;

?>

<nav
    id="accessibility-tools-nav"
    class="a11y-container"
    aria-label="<?= __('Inhalte zur Barrierefreiheit', 'AccessibilityTools'); ?>">
    <button
        type="button"
        class="a11y-button"
        commandfor="accessibility-tools"
        command="show-modal"
        title="<?= __('Optionen zur Barrierefreiheit anzeigen', 'AccessibilityTools'); ?>">
        #
    </button>

    <dialog
        id="accessibility-tools"
        class="a11y-dialog"
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
                    class="a11y-button"
                    title="<?= __('Optionen zur Barrierefreiheit ausblenden', 'AccessibilityTools'); ?>">
                    #
                </button>
            </form>
        </header>

        <div class="a11y-dialog-content">
            <?php if (!empty($enableContrastMode)): ?>
                KONTRAST
            <?php endif; ?>
            <?php if (!empty($enableFontSizeAdjust)): ?>
                SCHRIFT
            <?php endif; ?>
        </div>

        <footer>
            <nav aria-labelledby="accessibility-tools-footer-headline">
                <h3 id="accessibility-tools-footer-headline">Inhalte in zugänglicher Form:</h3>

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
                </ul>
            </nav>
        </footer>
    </dialog>
</nav>
