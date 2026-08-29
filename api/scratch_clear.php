<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$u = \App\Models\User::where('name', 'like', '%Pia%')->orWhere('email', 'like', '%pia%')->first();
if ($u) {
    echo "Found: " . $u->email . " (Balance: " . $u->balance . ")\n";
    \App\Models\TradingCodeRedemption::where('user_id', $u->id)->delete();
    $u->balance = 0;
    $u->save();
    echo "Cleared!\n";
} else {
    echo "Not found\n";
}
