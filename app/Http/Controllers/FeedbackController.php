<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the feedback.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with('user')->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        $feedback = $query->paginate(15);

        return response()->json($feedback);
    }

    /**
     * Store a newly created feedback in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:bug_report,feature_request,improvement,general',
        ]);

        $feedback = Feedback::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        $feedback->load('user');

        return response()->json([
            'message' => 'Feedback created successfully',
            'feedback' => $feedback
        ], 201);
    }

    /**
     * Display the specified feedback.
     */
    public function show(Feedback $feedback): JsonResponse
    {
        $feedback->load(['user', 'comments.user']);

        return response()->json([
            'feedback' => $feedback
        ]);
    }

    /**
     * Update the specified feedback in storage.
     */
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        // Check if user owns this feedback
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:bug_report,feature_request,improvement,general',
        ]);

        $feedback->update($validated);
        $feedback->load('user');

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback
        ]);
    }

    /**
     * Remove the specified feedback from storage.
     */
    public function destroy(Feedback $feedback): JsonResponse
    {
        // Check if user owns this feedback
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }

    /**
     * Get feedback by category.
     */
    public function getByCategory(string $category): JsonResponse
    {
        $feedback = Feedback::with('user')
            ->byCategory($category)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($feedback);
    }
}
