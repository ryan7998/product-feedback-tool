<?php

use Illuminate\Support\Facades\Route;

// Environment-aware routing
if (config('frontend.serve_from_laravel')) {
    // Production: Serve React app for all frontend routes
    Route::get('/{any}', function () {
        return view('app');
    })->where('any', '.*');
} else {
    // Local Development: Keep original welcome route for development
    Route::get('/', function () {
        return view('welcome');
    });
    
    // Optional: Add a development route to test the React view
    Route::get('/dev/react', function () {
        return view('app');
    });
}
