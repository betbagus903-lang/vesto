# AI Admin Assistant - Vesto Dashboard

An intelligent AI-powered admin assistant integrated into the Vesto E-commerce Dashboard using Google Gemini API.

## Features

- **Natural Language Commands**: Ask the AI to perform actions in plain English
- **Context-Aware**: Understands the current page and provides relevant suggestions
- **Action Execution**: Can create coupons, campaigns, generate SEO, and more
- **Beautiful UI**: Premium side panel design with dark theme support
- **Confirmation Required**: All actions require user confirmation before execution
- **Modular Architecture**: Easy to add new tools and capabilities

## Setup

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Configure Environment

Add your Gemini API key to your `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Restart Development Server

```bash
php artisan serve
npm run dev
```

## Usage

### Accessing the Assistant

The AI Assistant appears as a floating button at the bottom-right of every admin page. Click it to open the side panel.

### Supported Commands

#### Create Coupons
- "Create a coupon with 20% discount"
- "Generate a coupon code for new users"
- "Create free shipping coupon"

#### Create Campaigns
- "Create a Summer Sale campaign"
- "Generate a marketing campaign for products"
- "Create homepage banner campaign"

#### Generate SEO
- "Generate SEO for this product"
- "Create meta tags for homepage"
- "Generate SEO for categories"

#### Dashboard Analytics
- "Show today's sales statistics"
- "What should I do today?"
- "Show pending orders"
- "Suggest products to restock"

#### General Questions
- "How many active campaigns?"
- "What's our conversion rate?"
- "Generate marketing ideas"
- "Analyze customer behavior"

### Context-Aware Suggestions

The assistant provides contextual suggestions based on the current page:

- **Products page**: Generate descriptions, SEO, duplicate products
- **Campaigns page**: Create campaigns, analyze performance
- **Coupons page**: Create coupons, generate codes
- **SEO page**: Generate SEO, analyze performance
- **Orders page**: Summarize orders, check pending status
- **Dashboard**: Show analytics, restock suggestions

## Architecture

### Backend Components

#### GeminiService (`app/Services/AI/GeminiService.php`)
Handles communication with Google Gemini API.

#### ToolRegistry (`app/Services/AI/ToolRegistry.php`)
Manages available AI tools and their execution.

#### BaseTool (`app/Services/AI/Tools/BaseTool.php`)
Abstract base class for creating new AI tools.

#### AIAssistantController (`app/Http/Controllers/Admin/AIAssistantController.php`)
Handles HTTP requests for chat, execution, and suggestions.

### Frontend Components

#### AIAssistant (`resources/js/Components/AI/AIAssistant.jsx`)
Main React component with floating button and side panel.

### Available Tools

1. **CouponTool** - Create discount coupons
2. **CampaignTool** - Create marketing campaigns
3. **SeoTool** - Generate SEO metadata

## Adding New Tools

### 1. Create Tool Class

Create a new tool in `app/Services/AI/Tools/`:

```php
<?php

namespace App\Services\AI\Tools;

use App\Services\AI\Tools\BaseTool;

class MyCustomTool extends BaseTool
{
    public function getName(): string
    {
        return 'my_custom_action';
    }

    public function getDescription(): string
    {
        return 'Description of what this tool does';
    }

    public function getParameters(): array
    {
        return [
            'param1' => [
                'type' => 'string',
                'description' => 'Parameter description'
            ],
        ];
    }

    protected function getRequiredParameters(): array
    {
        return ['param1'];
    }

    public function execute(array $parameters): array
    {
        // Your logic here
        return [
            'success' => true,
            'data' => $result,
            'message' => 'Action completed'
        ];
    }
}
```

### 2. Register Tool

Add to `ToolRegistry.php`:

```php
protected function registerDefaultTools(): void
{
    $this->register(new CouponTool());
    $this->register(new CampaignTool());
    $this->register(new SeoTool());
    $this->register(new MyCustomTool()); // Add this
}
```

### 3. Update System Prompt

Add tool description to `AIAssistantController.php` system prompt.

## Security

- **No Direct Database Access**: Gemini only returns structured JSON actions
- **Validation**: Laravel validates all parameters before execution
- **Confirmation**: All actions require user confirmation
- **Permission Check**: Laravel's built-in authentication protects routes

## Future Enhancements

- [ ] Streaming responses for real-time typing effect
- [ ] Conversation history with search
- [ ] File upload support
- [ ] Image upload support
- [ ] Markdown rendering
- [ ] Syntax highlighting for code blocks
- [ ] More tools (Inventory, Analytics, Reports, Customer)

## Troubleshooting

### API Key Not Working
- Verify the API key is correct in `.env`
- Check if the key has the necessary permissions
- Ensure you have credits in your Google Cloud account

### Assistant Not Responding
- Check browser console for errors
- Verify the backend routes are accessible
- Check Laravel logs: `php artisan log:tail`

### Actions Not Executing
- Verify the tool is registered in ToolRegistry
- Check Laravel logs for validation errors
- Ensure database models exist and are accessible

## License

This AI Assistant is part of the Vesto E-commerce Dashboard.
