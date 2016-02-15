<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
	protected $table = 'courses';

	public function schedules()
    {
        return $this->hasMany('App\Schedule');
    }
}
