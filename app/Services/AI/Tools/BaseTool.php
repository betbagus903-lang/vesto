<?php

namespace App\Services\AI\Tools;

abstract class BaseTool
{
    /**
     * Tool name
     */
    abstract public function getName(): string;

    /**
     * Tool description
     */
    abstract public function getDescription(): string;

    /**
     * Tool parameters schema
     */
    abstract public function getParameters(): array;

    /**
     * Execute the tool
     */
    abstract public function execute(array $parameters): array;

    /**
     * Validate parameters
     */
    public function validate(array $parameters): bool
    {
        $required = $this->getRequiredParameters();
        
        foreach ($required as $param) {
            if (!isset($parameters[$param])) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Get required parameters
     */
    protected function getRequiredParameters(): array
    {
        return [];
    }

    /**
     * Format tool for Gemini API (and Mistral API)
     */
    public function toGeminiFormat(): array
    {
        $format = [
            'name' => $this->getName(),
            'description' => $this->getDescription(),
        ];

        $parameters = $this->getParameters();
        $required = $this->getRequiredParameters();

        if (!empty($parameters)) {
            $format['parameters'] = [
                'type' => 'object',
                'properties' => $parameters,
            ];

            if (!empty($required)) {
                $format['parameters']['required'] = $required;
            }
        } else {
            // If no parameters, provide empty object schema
            $format['parameters'] = [
                'type' => 'object',
                'properties' => new \stdClass(),
            ];
        }

        return $format;
    }
}
