<?php
namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

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

            // Log da resposta da API externa
            Log::info('Resposta da API de pagamento:', [
                'status' => $response->getStatusCode(),
                'body' => $response->getBody()->getContents()
            ]);

            return $response->getStatusCode() === 201;
        } catch (RequestException $e) {
            // Log da exceção
            Log::error('Erro na chamada da API de pagamento:', [
                'message' => $e->getMessage(),
                'response' => $e->hasResponse() ? $e->getResponse()->getBody()->getContents() : 'Sem resposta'
            ]);
            return false;
        } catch (Exception $e) {
            // Log de qualquer outra exceção
            Log::error('Erro inesperado na chamada da API de pagamento:', [
                'message' => $e->getMessage()
            ]);
            return false;
        }
    }
}