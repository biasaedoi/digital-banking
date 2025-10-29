<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        $fromAccountId = $this->input('from_account_id');
        return auth()->check() && 
               auth()->user()->accounts()->where('id', $fromAccountId)->exists();
    }

    public function rules(): array
    {
        return [
            'from_account_id' => 'required|integer|exists:accounts,id',
            'to_account_id'   => 'required|integer|exists:accounts,id|different:from_account_id',
            'amount'          => 'required|numeric|min:1',
            'description'     => 'nullable|string|max:255',
        ];
    }
}
