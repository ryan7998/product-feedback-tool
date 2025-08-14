<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $feedback = Feedback::with(['user', 'comments.user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $feedback->items(),
            'pagination' => [
                'current_page' => $feedback->currentPage(),
                'last_page' => $feedback->lastPage(),
                'per_page' => $feedback->perPage(),
                'total' => $feedback->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:10000',
            'category' => 'required|in:bug_report,feature_request,improvement,general',
            'priority' => 'sometimes|in:low,medium,high,urgent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback = Feedback::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority ?? 'medium',
            'user_id' => $request->user()->id,
        ]);

        $feedback->load('user');

        return response()->json([
            'message' => 'Feedback created successfully',
            'data' => $feedback
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $feedback = Feedback::with(['user', 'comments.user'])
            ->findOrFail($id);

        return response()->json([
            'data' => $feedback
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);

        // Check if user owns this feedback or is admin
        if ($feedback->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:10000',
            'category' => 'sometimes|in:bug_report,feature_request,improvement,general',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:open,in_progress,resolved,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback->update($request->only(['title', 'description', 'category', 'priority', 'status']));
        $feedback->load('user');

        return response()->json([
            'message' => 'Feedback updated successfully',
            'data' => $feedback
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);

        // Check if user owns this feedback or is admin
        if ($feedback->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }

    /**
     * Get feedback by category
     */
    public function getByCategory(string $category): JsonResponse
    {
        $validator = Validator::make(['category' => $category], [
            'category' => 'required|in:bug_report,feature_request,improvement,general',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid category',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback = Feedback::with(['user', 'comments.user'])
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $feedback->items(),
            'pagination' => [
                'current_page' => $feedback->currentPage(),
                'last_page' => $feedback->lastPage(),
                'per_page' => $feedback->perPage(),
                'total' => $feedback->total(),
            ]
        ]);
    }

    /**
     * Get feedback by status
     */
    public function getByStatus(string $status): JsonResponse
    {
        $validator = Validator::make(['status' => $status], [
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid status',
                'errors' => $validator->errors()
            ], 422);
        }

        $feedback = Feedback::with(['user', 'comments.user'])
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $feedback->items(),
            'pagination' => [
                'current_page' => $feedback->currentPage(),
                'last_page' => $feedback->lastPage(),
                'per_page' => $feedback->perPage(),
                'total' => $feedback->total(),
            ]
        ]);
    }
}
