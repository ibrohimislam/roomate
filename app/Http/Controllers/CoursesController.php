<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Course;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CoursesController extends Controller
{
	public function index() {
    	$courses = Course::all();
    	return response()->json($courses);
    }

    public function show($courseId) {
    	$course = Course::find($courseId);
    	return response()->json($course);
    }

	public function store() {
		$request = json_decode(request()->getContent());
	    
	    $course = new Course;
	    $course->name = $request->name;
	    $course->attendants = abs($request->attendants);
		$saved = $course->save();

	    return response()->json(array(
	        'error' => !$saved,
	        'courses' => $course->toArray()),
	        $saved?200:500
	    );
	}

    public function destroy($courseId) {
    	$course = Course::find($courseId);
    	$deleted = $course->delete();

	    return response()->json(array(
	        'error' => !$deleted,
	        'courses' => $course->toArray()),
	        $deleted?200:500
	    );
    }

    public function update($courseId) {
    	$request = json_decode(request()->getContent());
    	
    	$course = Course::find($courseId);
	    $course->name = $request->name;
	    $course->attendants = abs($request->attendants);
		$updated = $course->save();

	    return response()->json(array(
	        'error' => !$updated,
	        'courses' => $course->toArray()),
	        $updated?200:500
	    );
    }
}
