<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a specific feedback.
     */
    public function index(Feedback $feedback): JsonResponse
    {
        $comments = $feedback->comments()
            ->with(['user'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'data' => $comments
        ]);
    }

    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request, Feedback $feedback): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        // Extract mentions from content
        $mentions = $this->extractMentions($validated['content']);

        $comment = Comment::create([
            'content' => $validated['content'],
            'feedback_id' => $feedback->id,
            'user_id' => Auth::id(),
            'mentions' => $mentions,
        ]);

        $comment->load(['user']);

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment
        ], 201);
    }

    /**
     * Display the specified comment.
     */
    public function show(Feedback $feedback, Comment $comment): JsonResponse
    {
        $comment->load(['user']);

        return response()->json([
            'comment' => $comment
        ]);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, Feedback $feedback, Comment $comment): JsonResponse
    {
        // Check if user owns this comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        // Extract mentions from updated content
        $mentions = $this->extractMentions($validated['content']);

        $comment->update([
            'content' => $validated['content'],
            'mentions' => $mentions,
        ]);

        $comment->load(['user']);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy(Feedback $feedback, Comment $comment): JsonResponse
    {
        // Check if user owns this comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully'
        ]);
    }

    /**
     * Get comments by user.
     */
    public function getByUser(User $user): JsonResponse
    {
        $comments = $user->comments()
            ->with(['feedback', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($comments);
    }

    /**
     * Extract @mentions from comment content.
     * Returns array of user IDs that were mentioned.
     */
    private function extractMentions(string $content): array
    {
        $mentions = [];

        // Find all @mentions patterns - supports @FirstName LastName
        // This regex matches @ followed by one or more word characters and optional spaces + word characters
        // Uses word boundaries to ensure complete names
        preg_match_all('/@([a-zA-Z]+(?:\s+[a-zA-Z]+)*)/', $content, $matches);

        if (!empty($matches[1])) {
            $usernames = array_unique($matches[1]);

            // Clean up usernames by removing trailing words that aren't part of the name
            $cleanUsernames = [];
            foreach ($usernames as $username) {
                // Remove trailing words like "and", "or", etc.
                $cleanName = preg_replace('/\s+(and|or|but|the|a|an)\s*$/', '', $username);
                $cleanUsernames[] = trim($cleanName);
            }

            // Find users by exact name match
            $users = User::whereIn('name', $cleanUsernames)->pluck('id')->toArray();
            $mentions = $users;
        }

        return $mentions;
    }
}
