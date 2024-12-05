<?php
namespace App\Services;

use Exception;
use GuzzleHttp\Client;

class PaymentGatewayService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client(['base_uri' => 'https://dad-202425-payments-api.vercel.app/api/']);
    }

    public function createDebit($type, $reference, $value)
    {
        try {
            $response = $this->client->post('debit', [
                'json' => [
                    'type' => $type,
                    'reference' => $reference,
                    'value' => $value,
                ]
            ]);
            return $response->getStatusCode() === 201;
        } catch (Exception $e) {
            return false;
        }
    }
}
