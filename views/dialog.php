<?php

declare(strict_types=1);

namespace Hochwarth;

use function ProcessWire\__;

?>

<div>
    <button
        type="button"
        popoveraction="toggle"
        popovertarget="accessibility-tools"
        title="<?= __('Barrierefreiheitsoptionen umschalten', 'AccessibilityTools'); ?>">
        #
    </button>

    <dialog
        id="accessibility-tools"
        popover="manual">
        <button
            type="button"
            popoveraction="toggle"
            popovertarget="accessibility-tools"
            title="<?= __('Barrierefreiheitsoptionen umschalten', 'AccessibilityTools'); ?>">
            #
        </button>

        <p>hi</p>
    </dialog>
</div>
