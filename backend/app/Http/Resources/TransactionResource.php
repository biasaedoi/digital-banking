<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'from_account' => [
                'id' => $this->fromAccount->id,
                'account_number' => $this->fromAccount->account_number,
            ],
            'to_account' => [
                'id' => $this->toAccount->id,
                'account_number' => $this->toAccount->account_number,
            ],
            'amount' => (float) $this->amount,
            'description' => $this->description,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
