<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use App\Http\Resources\AccountResource;
use App\Helpers\ApiResponse;

class AccountController extends Controller
{
    
    public function index()
    {
        $accounts = Account::with('user')->get();
        return ApiResponse::success(AccountResource::collection($accounts), 'Accounts retrieved successfully');
    }

    
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'account_number' => 'required|unique:accounts',
                'balance' => 'required|numeric|min:0',
            ]);

            $account = Account::create($validated);
            return ApiResponse::success(new AccountResource($account), 'Account created successfully', 201);
        } catch (\Exception $e) {
            return ApiResponse::error($e->getMessage(), 400);
        }
    }

    public function show($id)
    {
        $account = Account::with('user')->findOrFail($id);
        
        
        if (auth()->id() !== $account->user_id) {
            return ApiResponse::error('Unauthorized access to this account.', 403);
        }

        return ApiResponse::success(new AccountResource($account), 'Account detail retrieved');
    }

    
    
    
    public function search(Request $request)
    {
        $validated = $request->validate(['account_number' => 'required|string|min:6']);
        
        $account = Account::with('user')
            ->where('account_number', $validated['account_number'])
            ->first();

        if (!$account) {
            return ApiResponse::error('Account number not found.', 404);
        }

        return ApiResponse::success(new AccountResource($account), 'Account found');
    }
}
