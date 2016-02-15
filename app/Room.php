<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';

    public function schedules()
    {
        return $this->hasMany('App\Schedule');
    }
}
