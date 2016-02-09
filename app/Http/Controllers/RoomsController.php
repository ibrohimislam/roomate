<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Room;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class RoomsController extends Controller
{

    public function index() {
    	$rooms = Room::all();
    	return response()->json($rooms);
    }

    public function show($roomId) {
    	$room = Room::find($roomId);
    	return response()->json($room);
    }

	public function store() {
		$request = json_decode(request()->getContent());
	    
	    $room = new Room;
	    $room->name = $request->name;
	    $room->capacity = $request->capacity;
	    $room->status = 0;
		$saved = $room->save();

	    return response()->json(array(
	        'error' => !$saved,
	        'rooms' => $room->toArray()),
	        $saved?200:500
	    );
	}

    public function destroy($roomId) {
    	$room = Room::find($roomId);
    	$deleted = $room->delete();

	    return response()->json(array(
	        'error' => !$deleted,
	        'rooms' => $room->toArray()),
	        $deleted?200:500
	    );
    }

    public function update($roomId) {
    	$request = json_decode(request()->getContent());
    	
    	$room = Room::find($roomId);
	    $room->name = $request->name;
	    $room->capacity = $request->capacity;
	    $room->status = $request->status;
		$updated = $room->save();

	    return response()->json(array(
	        'error' => !$updated,
	        'rooms' => $room->toArray()),
	        $updated?200:500
	    );
    }
}
