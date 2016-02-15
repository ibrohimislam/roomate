<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Schedule;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SchedulesController extends Controller {

    public function show($roomId, $date) {
    	// date parse
    	$objectDate = \DateTime::createFromFormat('m-d-Y', $date);
    	$filterDate = $objectDate->format("Y/m/d");

    	$schedules = Schedule::with(['course'])
    		->Where('room_id', $roomId)
    		->where('date', $filterDate)
    		->orderBy('start', 'asc')
    		->get();

    	return response()->json($schedules);
    	// if ($roomId == 1)
	    //     return response()->json(array(
		   //      'error' => false,
		   //      'schedules' => [
		   //      		array("start"=>1, "duration"=>3, "courseName" => "IF3230"),
		   //      		array("start"=>4, "duration"=>2, "courseName" => "IF3250"),
		   //      		array("start"=>6, "duration"=>1, "courseName" => "IF3240"),
		   //      	]),
		   //      200
		   //  );
	    // else
	    // 	return response()->json(array(
		   //      'error' => false,
		   //      'schedules' => [
		   //      		array("start"=>1, "duration"=>2, "courseName" => "IF2130"),
		   //      		array("start"=>3, "duration"=>3, "courseName" => "IF2150"),
		   //      		array("start"=>6, "duration"=>2, "courseName" => "IF3110"),
		   //      	]),
		   //      200
		   //  );
    }
}
