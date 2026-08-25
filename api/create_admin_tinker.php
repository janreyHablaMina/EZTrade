<?php

use App\Models\User;

$admin = User::firstOrCreate(
    ['email' => 'admin@eztrade.com'],
    [
        'name' => 'Super Admin',
        'password' => bcrypt('password'),
        'role' => 'admin'
    ]
);

echo "Admin ID: " . $admin->id . "\n";
