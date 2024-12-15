<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);

        return Inertia::render('Error', [
            'status' => $response->status(),
            'message' => app()->environment('production')
                ? $this->getProductionMessage($response->status())
                : $e->getMessage(),
            'debug' => app()->environment('local') ? [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => collect($e->getTrace())->map(fn ($trace) => array_only($trace, ['file', 'line']))->take(10),
            ] : null,
        ])->toResponse($request);
    }

    private function getProductionMessage($statusCode): string
    {
        return match($statusCode) {
            401 => 'Unauthorized access',
            403 => 'Forbidden access',
            404 => 'Page not found',
            419 => 'Page expired',
            429 => 'Too many requests',
            500 => 'Server error',
            503 => 'Service unavailable',
            default => 'An error occurred'
        };
    }
}
