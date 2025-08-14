<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Feedback routes
    Route::apiResource('feedback', FeedbackController::class);
    Route::get('/feedback/category/{category}', [FeedbackController::class, 'getByCategory']);
    Route::get('/feedback/status/{status}', [FeedbackController::class, 'getByStatus']);

    // Comment routes
    Route::apiResource('feedback.comments', CommentController::class);
    Route::get('/comments/user/{user}', [CommentController::class, 'getByUser']);
});

// Health check route
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'timestamp' => now()]);
});
