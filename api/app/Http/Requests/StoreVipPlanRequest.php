<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVipPlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'level' => 'required|string',
            'min_deposit' => 'required|numeric|min:0',
            'daily_profit_percent' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'status' => 'nullable|string'
        ];
    }
}
