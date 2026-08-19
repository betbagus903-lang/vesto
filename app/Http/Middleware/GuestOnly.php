<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuestOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            
            // Redirect based on role
            if ($user->role === 'admin') {
                return redirect('/admin/dashboard');
            }
            
            return redirect('/home');
        }

        return $next($request);
    }
}