<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, string $feedbackId): JsonResponse
    {
        $feedback = Feedback::findOrFail($feedbackId);

        $comments = Comment::with(['user', 'replies.user'])
            ->where('feedback_id', $feedbackId)
            ->whereNull('parent_id') // Only top-level comments
            ->orderBy('created_at', 'asc')
            ->paginate(20);

        return response()->json([
            'data' => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $feedbackId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
            'parent_id' => 'sometimes|exists:comments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if feedback exists
        $feedback = Feedback::findOrFail($feedbackId);

        // Process mentions in content
        $mentions = $this->extractMentions($request->content);

        $comment = Comment::create([
            'content' => $request->content,
            'feedback_id' => $feedbackId,
            'user_id' => $request->user()->id,
            'parent_id' => $request->parent_id,
            'mentions' => $mentions,
        ]);

        $comment->load(['user', 'replies.user']);

        return response()->json([
            'message' => 'Comment created successfully',
            'data' => $comment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $feedbackId, string $id): JsonResponse
    {
        $comment = Comment::with(['user', 'replies.user'])
            ->where('feedback_id', $feedbackId)
            ->findOrFail($id);

        return response()->json([
            'data' => $comment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $feedbackId, string $id): JsonResponse
    {
        $comment = Comment::where('feedback_id', $feedbackId)->findOrFail($id);

        // Check if user owns this comment
        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Process mentions in content
        $mentions = $this->extractMentions($request->content);

        $comment->update([
            'content' => $request->content,
            'mentions' => $mentions,
        ]);

        $comment->load(['user', 'replies.user']);

        return response()->json([
            'message' => 'Comment updated successfully',
            'data' => $comment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $feedbackId, string $id): JsonResponse
    {
        $comment = Comment::where('feedback_id', $feedbackId)->findOrFail($id);

        // Check if user owns this comment
        if ($comment->user_id !== request()->user()->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Get comments by user
     */
    public function getByUser(string $userId): JsonResponse
    {
        $user = User::findOrFail($userId);

        $comments = Comment::with(['feedback', 'user'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'user' => $user,
            'data' => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page' => $comments->lastPage(),
                'per_page' => $comments->perPage(),
                'total' => $comments->total(),
            ]
        ]);
    }

    /**
     * Extract user mentions from content (@username)
     */
    private function extractMentions(string $content): array
    {
        preg_match_all('/@(\w+)/', $content, $matches);

        if (empty($matches[1])) {
            return [];
        }

        $usernames = $matches[1];
        $users = User::whereIn('name', $usernames)->pluck('id')->toArray();

        return $users;
    }
}
