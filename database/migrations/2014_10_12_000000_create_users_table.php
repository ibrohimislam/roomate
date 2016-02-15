<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password', 60);
            $table->rememberToken();
            $table->timestamps();
        });

        //seed
        DB::table('users')->insert(array(array('name' => 'ibrohim', 'email'=>'ibrohimislam@gmail.com', 'password'=>'$2a$12$MO4L5XyU15NAHk39GCB3luV0uYvi5sfKCb/02YAdvFF4VGnjMUDVi'),));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}
