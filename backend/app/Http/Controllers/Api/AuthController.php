<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Helpers\ApiResponse;
use App\Repositories\AccountRepository;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{

    public function __construct(protected AccountRepository $accountRepository)
    {
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);


        $accountData = [
            'user_id' => $user->id,
            'account_number' => 'ACC-' . time() . rand(100000, 999999),
            'balance' => 0.00,
        ];

        $this->accountRepository->create($accountData);


        $user->load('accounts');


        return ApiResponse::success(new UserResource($user), 'User and initial account registered successfully', 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
        }

        $token = $user->createToken('api-token')->plainTextToken;


        $user->load('accounts');


        return ApiResponse::success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful');
    }

    public function me(Request $request)
    {

        $user = $request->user()->load('accounts');
        return ApiResponse::success(new UserResource($user), 'User profile retrieved');
    }
}