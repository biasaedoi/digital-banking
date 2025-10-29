<?php

namespace App\Services;

use App\Repositories\AccountRepository;
use App\Repositories\TransactionRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Models\Account; 

class TransferService
{
    public function __construct(
        protected AccountRepository $accounts,
        protected TransactionRepository $transactions
    ) {}

    public function transfer(int $fromId, int $toId, float $amount, ?string $description = null)
    {
        if ($fromId === $toId) {
            throw ValidationException::withMessages(['to_account_id' => 'Cannot transfer to the same account.']);
        }

        return DB::transaction(function () use ($fromId, $toId, $amount, $description) {
            $from = $this->accounts->findForUpdate($fromId);
            $to = $this->accounts->findForUpdate($toId);

            if (!$from || !$to) {
                \Log::error('Account not found', compact('fromId', 'toId'));
                throw ValidationException::withMessages(['account' => 'One or both accounts not found.']);
            }

            if (bccomp((string)$from->balance, (string)$amount, 2) < 0) {
                \Log::error('Insufficient balance', compact('fromId', 'amount') + ['balance' => $from->balance]);
                throw ValidationException::withMessages(['amount' => 'Insufficient balance.']);
            }

            \Log::info('Before update', ['from' => $from->balance, 'to' => $to->balance]);

            $this->accounts->decrementBalance($from, $amount);
            $this->accounts->incrementBalance($to, $amount);

            \Log::info('After update', [
                'from' => $from->fresh()->balance,
                'to' => $to->fresh()->balance,
            ]);

            $transaction = $this->transactions->log($from->id, $to->id, $amount, $description);

            return $transaction;
        });
    }

    public function deposit(int $accountId, float $amount): Account
    {
        return DB::transaction(function () use ($accountId, $amount) {
            $account = $this->accounts->findForUpdate($accountId);

            if (!$account) {
                throw ValidationException::withMessages(['account' => 'Account not found.']);
            }

            $this->accounts->incrementBalance($account, $amount);
            
            
            

            return $account->fresh();
        });
    }
    
    public function withdraw(int $accountId, float $amount): Account
    {
        return DB::transaction(function () use ($accountId, $amount) {
            $account = $this->accounts->findForUpdate($accountId);

            if (!$account) {
                throw ValidationException::withMessages(['account' => 'Account not found.']);
            }

            
            if (bccomp((string)$account->balance, (string)$amount, 2) < 0) {
                throw ValidationException::withMessages(['amount' => 'Insufficient balance for withdrawal.']);
            }

            $this->accounts->decrementBalance($account, $amount);
            return $account->fresh();
        });
    }
}
