<?php

namespace App\Services\AI;

use App\Services\AI\Tools\BaseTool;
use App\Services\AI\Tools\CouponTool;
use App\Services\AI\Tools\CampaignTool;
use App\Services\AI\Tools\SeoTool;
use App\Services\AI\Tools\ProductTool;
use App\Services\AI\Tools\CategoryTool;

class ToolRegistry
{
    protected array $tools = [];

    public function __construct()
    {
        $this->registerDefaultTools();
    }

    /**
     * Register default tools
     */
    protected function registerDefaultTools(): void
    {
        $this->register(new CouponTool());
        $this->register(new CampaignTool());
        $this->register(new SeoTool());
        $this->register(new ProductTool());
        $this->register(new CategoryTool());
    }

    /**
     * Register a tool
     */
    public function register(BaseTool $tool): void
    {
        $this->tools[$tool->getName()] = $tool;
    }

    /**
     * Get a tool by name
     */
    public function get(string $name): ?BaseTool
    {
        return $this->tools[$name] ?? null;
    }

    /**
     * Get all tools
     */
    public function all(): array
    {
        return $this->tools;
    }

    /**
     * Get tools formatted for Gemini API
     */
    public function toGeminiFormat(): array
    {
        return array_values(array_map(function (BaseTool $tool) {
            return $tool->toGeminiFormat();
        }, $this->tools));
    }

    /**
     * Execute a tool
     */
    public function execute(string $toolName, array $parameters): array
    {
        $tool = $this->get($toolName);
        
        if (!$tool) {
            return [
                'success' => false,
                'error' => "Tool '{$toolName}' not found"
            ];
        }

        return $tool->execute($parameters);
    }
}
