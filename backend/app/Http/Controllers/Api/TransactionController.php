<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransferRequest;
use App\Repositories\TransactionRepository;
use App\Services\TransferService;
use App\Http\Resources\TransactionResource;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Http\Resources\AccountResource;
use Exception;

class TransactionController extends Controller
{
    protected TransferService $transferService;
    protected TransactionRepository $transactionRepo;

    public function __construct(TransferService $transferService, TransactionRepository $transactionRepo)
    {
        $this->transferService = $transferService;
        $this->transactionRepo = $transactionRepo;
    }

    public function transfer(TransferRequest $request)
    {
        try {
            $transaction = $this->transferService->transfer(
                $request->from_account_id,
                $request->to_account_id,
                $request->amount,
                $request->description ?? null
            );

            return ApiResponse::success(new TransactionResource($transaction), 'Transfer successful', 201);
        } catch (Exception $e) {
            return ApiResponse::error('Transfer failed', 400, $e->getMessage());
        }
    }

    public function history($accountId)
    {
        $user = auth()->user();



        if (!$user) {
            return ApiResponse::error('Unauthenticated.', 401);
        }



        if (!$user->accounts()->where('id', $accountId)->exists()) {

            \Log::warning('Unauthorized access attempt to transaction history', [
                'user_id' => $user->id,
                'requested_account_id' => $accountId
            ]);
            return ApiResponse::error('Unauthorized access to this account history.', 403);
        }

        try {


            $transactions = $this->transactionRepo->getByAccountIdWithRelations((int) $accountId);


            return ApiResponse::success(TransactionResource::collection($transactions), 'Transaction history retrieved successfully');
        } catch (Exception $e) {

            \Log::error('Failed to retrieve transaction history', ['error' => $e->getMessage(), 'account_id' => $accountId]);
            return ApiResponse::error('Failed to retrieve transaction history', 500, $e->getMessage());
        }
    }

    public function deposit(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|integer|exists:accounts,id',
            'amount' => 'required|numeric|min:1000',
        ]);

        if (auth()->id() !== Account::findOrFail($validated['account_id'])->user_id) {
            return ApiResponse::error('Unauthorized access.', 403);
        }

        try {
            $account = $this->transferService->deposit(
                $validated['account_id'],
                $validated['amount']
            );

            return ApiResponse::success(new AccountResource($account), 'Deposit successful. New balance: ' . $account->balance, 200);
        } catch (Exception $e) {
            return ApiResponse::error('Deposit failed', 400, $e->getMessage());
        }
    }

    public function withdraw(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|integer|exists:accounts,id',
            'amount' => 'required|numeric|min:1000',
        ]);

        $account = Account::findOrFail($validated['account_id']);
        if (auth()->id() !== $account->user_id) {
            return ApiResponse::error('Unauthorized access.', 403);
        }

        try {
            $account = $this->transferService->withdraw(
                $validated['account_id'],
                $validated['amount']
            );

            return ApiResponse::success(new AccountResource($account), 'Withdrawal successful. New balance: ' . $account->balance, 200);
        } catch (Exception $e) {
            return ApiResponse::error('Withdrawal failed', 400, $e->getMessage());
        }
    }
}
