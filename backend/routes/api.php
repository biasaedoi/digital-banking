<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\AuthController;

Route::prefix('auth')->controller(AuthController::class)->group(function () {
    
    Route::post('register', 'register'); 
    Route::post('login', 'login');
});


Route::get('/accounts', [AccountController::class, 'index']);
Route::post('/accounts', [AccountController::class, 'store']);



Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    
    Route::get('/account/{id}', [AccountController::class, 'show']); 
    Route::post('/accounts/search', [AccountController::class, 'search']); 
    
    
    Route::post('/transactions/deposit', [TransactionController::class, 'deposit']);
    Route::post('/transactions/withdraw', [TransactionController::class, 'withdraw']); 
    Route::post('/transactions/transfer', [TransactionController::class,'transfer']); 
    Route::get('/transactions/history/{accountId}', [TransactionController::class, 'history']);

    
    
});
