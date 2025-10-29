<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        $defaultAccountData = [
            'id' => null,
            'account_number' => null,
            'balance' => 0.00,
        ];

        $accountsData = $this->whenLoaded('accounts', function () use ($defaultAccountData) {
            $firstAccount = $this->accounts->first();
            
            return $firstAccount ? [
                'id' => $firstAccount->id,
                'account_number' => $firstAccount->account_number,
                'balance' => (float) $firstAccount->balance,
            ] : $defaultAccountData; 
        }, $defaultAccountData); 
        
        
        if (is_null($accountsData) || (is_array($accountsData) && !isset($accountsData['id']))) {
            $accountsData = $defaultAccountData;
        }


        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'account' => $accountsData,
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
        ];
    }
}