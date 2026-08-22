<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OkxService
{
    protected $baseUrl;
    protected $apiKey;
    protected $secretKey;
    protected $passphrase;

    public function __construct()
    {
        // For production, the base url is https://www.okx.com
        $this->baseUrl = 'https://www.okx.com';
        $this->apiKey = env('OKX_API_KEY');
        $this->secretKey = env('OKX_SECRET_KEY');
        $this->passphrase = env('OKX_PASSPHRASE');
    }

    /**
     * Fetch recent deposits from OKX.
     * 
     * @param string $currency (e.g. USDT)
     * @return array
     */
    public function getRecentDeposits($currency = 'USDT')
    {
        $endpoint = '/api/v5/asset/deposit-history';
        $query = "?ccy={$currency}";
        $requestPath = $endpoint . $query;

        try {
            $timestamp = $this->getIso8601Timestamp();
            $method = 'GET';
            $sign = $this->generateSignature($timestamp, $method, $requestPath);

            $response = Http::withoutVerifying()->withHeaders([
                'OK-ACCESS-KEY' => $this->apiKey,
                'OK-ACCESS-SIGN' => $sign,
                'OK-ACCESS-TIMESTAMP' => $timestamp,
                'OK-ACCESS-PASSPHRASE' => $this->passphrase,
                'Content-Type' => 'application/json'
            ])->get($this->baseUrl . $requestPath);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['code']) && $data['code'] === '0') {
                    return $data['data'] ?? [];
                }
                Log::error("OKX API Error", ['response' => $data]);
                return [];
            }

            Log::error("OKX API Request Failed", [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return [];
        } catch (\Exception $e) {
            Log::error("OKX API Exception", ['message' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Generate OKX API Signature
     * 
     * @param string $timestamp
     * @param string $method
     * @param string $requestPath
     * @param string $body
     * @return string
     */
    protected function generateSignature($timestamp, $method, $requestPath, $body = '')
    {
        $message = $timestamp . strtoupper($method) . $requestPath . $body;
        return base64_encode(hash_hmac('sha256', $message, $this->secretKey, true));
    }

    /**
     * Get current timestamp in ISO 8601 format required by OKX
     * Example: 2020-12-08T09:08:57.715Z
     * 
     * @return string
     */
    protected function getIso8601Timestamp()
    {
        // Using gmdate and microtime to format the timestamp
        $t = microtime(true);
        $micro = sprintf("%03d", (int) round(($t - floor($t)) * 1000));
        $date = new \DateTime(date('Y-m-d H:i:s.' . $micro, (int) $t));
        $date->setTimezone(new \DateTimeZone('UTC'));
        return $date->format('Y-m-d\TH:i:s.v\Z');
    }
}
