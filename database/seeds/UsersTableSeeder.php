<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Mutsanna Qoid A',
            'email' => 'am.qoid@mutsanna.xyz',
            'email_verified_at' => now(),
            'password' => bcrypt('root'),
            'role' => 0
        ]);
    }
}
