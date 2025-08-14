<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Feedback;
use App\Models\Comment;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo users
        $users = [
            ['name' => 'John Smith', 'email' => 'john@example.com', 'password' => 'password'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah@example.com', 'password' => 'password'],
            ['name' => 'Mike Chen', 'email' => 'mike@example.com', 'password' => 'password'],
            ['name' => 'Emily Davis', 'email' => 'emily@example.com', 'password' => 'password'],
            ['name' => 'Alex Rodriguez', 'email' => 'alex@example.com', 'password' => 'password'],
            ['name' => 'Lisa Wang', 'email' => 'lisa@example.com', 'password' => 'password'],
            ['name' => 'David Brown', 'email' => 'david@example.com', 'password' => 'password'],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => bcrypt($userData['password']),
            ]);
            $createdUsers[] = $user;
        }

        // Create demo feedback
        $feedback = [
            [
                'title' => 'Performance Optimization Needed',
                'description' => 'The application is running slowly on mobile devices. We need to optimize the database queries and implement caching.',
                'category' => 'improvement',
                'user_id' => $createdUsers[0]->id
            ],
            [
                'title' => 'Login Bug on Safari',
                'description' => 'Users are experiencing login issues specifically on Safari browsers. The authentication flow seems to break.',
                'category' => 'bug_report',
                'user_id' => $createdUsers[1]->id
            ],
            [
                'title' => 'Dark Mode Feature Request',
                'description' => 'Many users have requested a dark mode theme option. This would improve accessibility and reduce eye strain.',
                'category' => 'feature_request',
                'user_id' => $createdUsers[2]->id
            ],
            [
                'title' => 'Better Error Messages',
                'description' => 'Current error messages are not user-friendly. We should provide clearer guidance when things go wrong.',
                'category' => 'improvement',
                'user_id' => $createdUsers[3]->id
            ],
            [
                'title' => 'Export Data Functionality',
                'description' => 'Users need the ability to export their data in various formats (CSV, JSON, PDF) for reporting purposes.',
                'category' => 'feature_request',
                'user_id' => $createdUsers[4]->id
            ]
        ];

        $createdFeedback = [];
        foreach ($feedback as $feedbackData) {
            $feedbackItem = Feedback::create($feedbackData);
            $createdFeedback[] = $feedbackItem;
        }

        // Create some comments with @mentions and formatting
        $comments = [
            [
                'content' => "This is a **great idea**! I think it would really help with *user experience*. Maybe we could also add `feature flags` for gradual rollout.",
                'feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[1]->id,
                'mentions' => $this->extractMentions("This is a **great idea**! I think it would really help with *user experience*. Maybe we could also add `feature flags` for gradual rollout.")
            ],
            [
                'content' => "I agree with @John Smith! The **performance improvements** are definitely needed. We should also consider *mobile optimization*.",
                'feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[2]->id,
                'mentions' => $this->extractMentions("I agree with @John Smith! The **performance improvements** are definitely needed. We should also consider *mobile optimization*.")
            ],
            [
                'content' => "Thanks @Sarah Johnson! I've been working on this for a while. The `API endpoints` are ready, just need frontend integration.",
                'feedback_id' => $createdFeedback[0]->id,
                'user_id' => $createdUsers[0]->id,
                'mentions' => $this->extractMentions("Thanks @Sarah Johnson! I've been working on this for a while. The `API endpoints` are ready, just need frontend integration.")
            ],
            [
                'content' => "This bug is **really annoying**! It happens every time I try to *save my work*. The `error logs` show nothing useful.",
                'feedback_id' => $createdFeedback[1]->id,
                'user_id' => $createdUsers[3]->id,
                'mentions' => $this->extractMentions("This bug is **really annoying**! It happens every time I try to *save my work*. The `error logs` show nothing useful.")
            ],
            [
                'content' => "I can reproduce this issue. It seems to be related to the *authentication flow*. Maybe we need to check the `session handling`.",
                'feedback_id' => $createdFeedback[1]->id,
                'user_id' => $createdUsers[4]->id,
                'mentions' => $this->extractMentions("I can reproduce this issue. It seems to be related to the *authentication flow*. Maybe we need to check the `session handling`.")
            ],
            [
                'content' => "Great suggestion @Mike Chen! I love the idea of **dark mode**. It would definitely improve *accessibility* and look more `professional`.",
                'feedback_id' => $createdFeedback[2]->id,
                'user_id' => $createdUsers[5]->id,
                'mentions' => $this->extractMentions("Great suggestion @Mike Chen! I love the idea of **dark mode**. It would definitely improve *accessibility* and look more `professional`.")
            ],
            [
                'content' => "I second this! **Dark mode** is essential for *night-time usage*. We could use `CSS variables` for easy theming.",
                'feedback_id' => $createdFeedback[2]->id,
                'user_id' => $createdUsers[6]->id,
                'mentions' => $this->extractMentions("I second this! **Dark mode** is essential for *night-time usage*. We could use `CSS variables` for easy theming.")
            ]
        ];

        // Create comments with formatting
        foreach ($comments as $commentData) {
            Comment::create([
                'content' => $commentData['content'],
                'formatted_content' => $this->parseCommentFormatting($commentData['content']),
                'feedback_id' => $commentData['feedback_id'],
                'user_id' => $commentData['user_id'],
                'mentions' => $commentData['mentions']
            ]);
        }
    }

    /**
     * Extract @mentions from comment content.
     * Returns array of user IDs that were mentioned.
     */
    private function extractMentions(string $content): array
    {
        $mentions = [];

        // Find all @mentions patterns - supports @FirstName LastName
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
        $content = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $content);

        // Parse *italic* text
        $content = preg_replace('/\*(.*?)\*/', '<em>$1</em>', $content);

        // Parse `code` blocks
        $content = preg_replace('/`(.*?)`/', '<code>$1</code>', $content);

        return $content;
    }
}
