<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Schedule;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SchedulesController extends Controller {

	public function index($roomId) {
    	$schedules = Schedule::with(['course'])
    		->Where('room_id', $roomId)
    		->orderBy('start', 'asc')
    		->get();

    	return response()->json($schedules);
    }

    public function show($roomId, $date) {
    	$objectDate = \DateTime::createFromFormat('m-d-Y', $date);
    	$filterDate = $objectDate->format("Y/m/d");

    	$schedules = Schedule::with(['course'])
    		->Where('room_id', $roomId)
    		->where('date', $filterDate)
    		->orderBy('start', 'asc')
    		->get();

    	return response()->json($schedules);
    }
}
