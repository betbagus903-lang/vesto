<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AIChatSession extends Model
{
    protected $table = 'ai_chat_sessions';
    
    protected $fillable = [
        'user_id',
        'title',
        'messages',
        'language',
        'is_active',
    ];

    protected $casts = [
        'messages' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user that owns the chat session.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the first message as title if title is default
     */
    public function getDisplayTitleAttribute(): string
    {
        if ($this->title !== 'New Chat') {
            return $this->title;
        }

        if (!empty($this->messages)) {
            $firstUserMessage = collect($this->messages)->firstWhere('role', 'user');
            if ($firstUserMessage) {
                return substr($firstUserMessage['content'], 0, 30) . '...';
            }
        }

        return 'New Chat';
    }
}
