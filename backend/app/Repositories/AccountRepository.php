<?php

namespace App\Repositories;

use App\Models\Account;

class AccountRepository
{
    public function find(int $id): ?Account
    {
        return Account::find($id);
    }

    public function findForUpdate(int $id): ?Account
    {
        return Account::where('id', $id)->lockForUpdate()->first();
    }

    public function decrementBalance(Account $account, float $amount): void
    {
        $account->decrement('balance', $amount);
        $account->refresh();
    }

    public function incrementBalance(Account $account, float $amount): void
    {
        $account->increment('balance', $amount);
        $account->refresh();
    }

    public function create(array $data): Account
    {
        return Account::create($data);
    }
}
