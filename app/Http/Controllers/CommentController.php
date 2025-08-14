<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a specific feedback.
     */
    public function index(Feedback $feedback): JsonResponse
    {
        $comments = $feedback->comments()
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comments);
    }

    /**
     * Store a newly created comment.
     */
    public function store(Request $request, Feedback $feedback): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $feedback->comments()->create([
            'content' => $validated['content'],
            'formatted_content' => $this->parseCommentFormatting($validated['content']),
            'user_id' => Auth::id(),
            'mentions' => $this->extractMentions($validated['content'])
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
        return response()->json(['data' => $comment]);
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, Feedback $feedback, Comment $comment): JsonResponse
    {
        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment->update([
            'content' => $validated['content'],
            'formatted_content' => $this->parseCommentFormatting($validated['content']),
            'mentions' => $this->extractMentions($validated['content'])
        ]);

        $comment->load(['user']);

        return response()->json([
            'message' => 'Comment updated successfully',
            'comment' => $comment
        ]);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Feedback $feedback, Comment $comment): JsonResponse
    {
        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }

    /**
     * Get comments by a specific user.
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
     * Search users for @mentions.
     */
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['data' => []]);
        }

        $users = User::where('name', 'LIKE', "%{$query}%")
            ->select(['id', 'name', 'email'])
            ->limit(10)
            ->get();

        return response()->json(['data' => $users]);
    }

    /**
     * Extract @mentions from comment content.
     * Returns array of user IDs that were mentioned.
     */
    private function extractMentions(string $content): array
    {
        $mentions = [];

        // Find all @mentions patterns - supports @FirstName LastName
        // Use a regex that captures names more precisely by looking for common patterns
        preg_match_all('/@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/', $content, $matches);

        if (!empty($matches[1])) {
            $usernames = array_unique($matches[1]);

            // Find users by exact name match
            $users = User::whereIn('name', $usernames)->pluck('id')->toArray();
            $mentions = $users;
        }

        return $mentions;
    }

    /**
     * Parse comment content for basic formatting.
     * Supports: **bold**, *italic*, `code`, and @mentions
     */
    private function parseCommentFormatting(string $content): string
    {
        // Parse @mentions first (preserve them)
        $content = preg_replace('/@([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/', '<span class="mention">@$1</span>', $content);

        // Parse **bold** text
        $content = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $content);

        // Parse *italic* text
        $content = preg_replace('/\*(.*?)\*/s', '<em>$1</em>', $content);

        // Parse `code` blocks - escape HTML characters
        $content = preg_replace_callback('/`(.*?)`/s', function ($matches) {
            $code = htmlspecialchars($matches[1], ENT_QUOTES, 'UTF-8');
            return "<code>{$code}</code>";
        }, $content);

        return $content;
    }
}
