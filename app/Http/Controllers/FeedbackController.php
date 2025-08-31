<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Display a paginated listing of feedback items.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::with(['user'])
            ->orderBy('created_at', 'desc');

        // Apply category filter if provided
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $feedback = $query->paginate(15);

        return response()->json($feedback);
    }

    /**
     * Store a newly created feedback item.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category' => 'required|in:bug_report,feature_request,improvement,general',
        ]);

        $feedback = Feedback::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'user_id' => Auth::id(),
        ]);

        $feedback->load(['user']);

        return response()->json([
            'message' => 'Feedback created successfully',
            'feedback' => $feedback
        ], 201);
    }

    /**
     * Display the specified feedback item.
     */
    public function show(Feedback $feedback): JsonResponse
    {
        $feedback->load(['user']);
        return response()->json(['data' => $feedback]);
    }

    /**
     * Update the specified feedback item.
     */
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        // Check if user owns the feedback
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category' => 'required|in:bug_report,feature_request,improvement,general',
        ]);

        $feedback->update($validated);
        $feedback->load(['user']);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'feedback' => $feedback
        ]);
    }

    /**
     * Remove the specified feedback item.
     */
    public function destroy(Feedback $feedback): JsonResponse
    {
        // Check if user owns the feedback
        if ($feedback->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback->delete();

        return response()->json(['message' => 'Feedback deleted successfully']);
    }

    /**
     * Get feedback items by category.
     */
    public function getByCategory(string $category): JsonResponse
    {
        $feedback = Feedback::where('category', $category)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($feedback);
    }
}
