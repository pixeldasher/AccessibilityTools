<?php

declare(strict_types=1);

namespace Hochwarth;

use ProcessWire\ModuleConfig;

use function ProcessWire\__;

class AccessibilityToolsConfig extends ModuleConfig
{
    public function __construct()
    {
        $this->add([
            // --- Allgemeine Einstellungen ---
            [
                'type' => 'fieldset',
                'label' => __('Allgemeine Einstellungen'),
                'icon' => 'cogs',
                'description' => __('Grundeinstellungen zur Aktivierung oder Deaktivierung des Moduls.'),
                'children' => [
                    [
                        'name' => 'enabled',
                        'type' => 'checkbox',
                        'label' => __('Accessibility Tools aktivieren'),
                        'label2' => __('Barrierefreiheitsoptionen im Frontend anzeigen'),
                        'value' => false,
                    ],
                ]
            ],
            // --- Funktionen ---
            [
                'type' => 'fieldset',
                'label' => __('Funktionen'),
                'icon' => 'toggle-on',
                'description' => __('Festlegen, welche Barrierefreiheitsfunktionen zur Verfügung stehen sollen.'),
                'showIf' => 'enabled=1',
                'children' => [
                    [
                        'name' => 'enable_contrast_mode',
                        'type' => 'checkbox',
                        'label' => __('Kontrastmodus anbieten'),
                        'label2' => __('Ermöglicht den Wechsel zu einer kontrastreichen Version.'),
                        'value' => true,
                        'columnWidth' => 50,
                    ],
                    [
                        'name' => 'enable_font_size_adjust',
                        'type' => 'checkbox',
                        'label' => __('Schriftgrößenanpassung anbieten'),
                        'label2' => __('Ermöglicht die Vergrößerung oder Verkleinerung der Schriftgröße.'),
                        'value' => true,
                        'columnWidth' => 50,
                    ],
                ]
            ],
            // --- Barrierefreiheits-Verlinkungen ---
            [
                'type' => 'fieldset',
                'label' => __('Barrierefreiheits-Verlinkungen'),
                'icon' => 'link',
                'description' => __('Seiten für "Leichte Sprache" und "Gebärdensprache" auswählen, deren Links im Dialogfeld angezeigt werden.'),
                'showIf' => 'enabled=1',
                'children' => [
                    [
                        'name' => 'easy_language_page',
                        'type' => 'PageListSelect',
                        'label' => __('Seite für Leichte Sprache'),
                        'description' => __('Auswahl der Seite, die Inhalte in "Leichter Sprache" enthält.'),
                        'value' => 0,
                    ],
                    [
                        'name' => 'sign_language_page',
                        'type' => 'PageListSelect',
                        'label' => __('Seite für Gebärdensprache'),
                        'description' => __('Auswahl der Seite, die Inhalte in "Gebärdensprache" enthält.'),
                        'value' => 0,
                    ],
                ]
            ],
        ]);
    }
}
