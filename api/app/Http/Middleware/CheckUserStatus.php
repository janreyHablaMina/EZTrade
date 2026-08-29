<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth('sanctum')->user();

        if ($user) {
            if ($user->status === 'Suspended' || $user->status === 'Inactive') {
                return response()->json([
                    'error' => 'account_suspended',
                    'message' => 'Your account has been suspended or deactivated. Please contact support.'
                ], 403);
            }
        }

        return $next($request);
    }
}
