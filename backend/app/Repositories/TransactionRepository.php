<?php

namespace App\Repositories;

use App\Models\Transaction;

class TransactionRepository
{
    public function log(int $fromAccountId, int $toAccountId, float $amount, ?string $description = null): Transaction
    {
        return Transaction::create([
            'from_account_id' => $fromAccountId,
            'to_account_id' => $toAccountId,
            'amount' => $amount,
            'description' => $description,
        ]);
    }

    public function getByAccountId(int $accountId)
    {
        
        return Transaction::where('from_account_id', $accountId)
            ->orWhere('to_account_id', $accountId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
    
    public function getByAccountIdWithRelations(int $accountId)
    {
        
        return Transaction::with(['fromAccount', 'toAccount']) 
            ->where('from_account_id', $accountId)
            ->orWhere('to_account_id', $accountId)
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
