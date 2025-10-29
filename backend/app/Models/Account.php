<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'account_number', 'balance'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactionsSent()
    {
        return $this->hasMany(Transaction::class, 'from_account_id');
    }

    public function transactionsReceived()
    {
        return $this->hasMany(Transaction::class, 'to_account_id');
    }
}
