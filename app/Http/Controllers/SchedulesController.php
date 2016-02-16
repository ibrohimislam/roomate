<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Schedule;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class SchedulesController extends Controller {

	public function index($roomId) {
        if ($roomId == "_"){
            $schedules = Schedule::with(['course', 'room'])
                ->orderBy('start', 'asc')
                ->get();
        } else {
            $schedules = Schedule::with(['course'])
                ->Where('room_id', $roomId)
                ->orderBy('start', 'asc')
                ->get();
        }

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

    public function store($roomId) {
        $request = json_decode(request()->getContent());
        
        $schedule = new Schedule;
        $schedule->date = $request->date;
        $schedule->start = $request->start;
        $schedule->course_id = $request->course_id;
        $schedule->duration = $request->duration;
        $schedule->room_id = $roomId;
        $saved = $schedule->save();

        return response()->json(array(
            'error' => !$saved,
            'schedule' => $schedule->toArray()),
            $saved?200:500
        );
    }

    public function destroy($roomId, $id) {
        $schedule = Schedule::find($id);
        $deleted = $schedule->delete();

        return response()->json(array(
            'error' => !$deleted,
            'schedules' => $schedule->toArray()),
            $deleted?200:500
        );
    }
}
