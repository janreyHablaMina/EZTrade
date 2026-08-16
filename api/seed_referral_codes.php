<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$users = App\Models\User::whereNull('referral_code')->get();
foreach ($users as $user) {
    do {
        $bytes = random_bytes(6);
        $code = strtoupper(substr(str_replace(['+', '/', '='], '', base64_encode($bytes)), 0, 8));
    } while (App\Models\User::where('referral_code', $code)->exists());
    $user->referral_code = $code;
    $user->save();
}
echo "Seeded referral codes for " . $users->count() . " users.\n";
