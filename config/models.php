<?php

$models = [
    'tickets' => \App\Models\Tickets::class,
    'historias' => \App\Models\Historias::class,
    'user' => \App\Models\User::class,
    // Agrega más modelos según sea necesario
];

$validModels = [];
$invalidModels = [];

foreach ($models as $type => $model) {
    if (class_exists($model)) {
        $validModels[$type] = $model;
    } else {
        $invalidModels[$type] = $model;
    }
}

return [
    'valid' => $validModels,
    'invalid' => $invalidModels,
];
