<template>
  <div class="purchase-brain-coins container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-md">
    <h1 class="text-2xl font-bold text-center mb-6">Compra de Brain Coins</h1>
    <form @submit.prevent="purchaseBrainCoins" class="space-y-4">
      <div class="form-group">
        <label for="paymentType" class="block text-gray-700 font-medium mb-2">Tipo de Pagamento:</label>
        <select id="paymentType" v-model="paymentType" @blur="validatePaymentType"
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PAYPAL</option>
          <option value="IBAN">IBAN</option>
          <option value="MB">MB</option>
          <option value="VISA">VISA</option>
        </select>
        <div v-if="errors.paymentType" class="text-red-500 text-sm mt-1">{{ errors.paymentType }}</div>
      </div>

      <div class="form-group">
        <label for="paymentReference" class="block text-gray-700 font-medium mb-2">Referência de Pagamento:</label>
        <input type="text" id="paymentReference" v-model="paymentReference" @blur="validatePaymentReference" required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <div v-if="errors.paymentReference" class="text-red-500 text-sm mt-1">{{ errors.paymentReference }}</div>
      </div>

      <div class="form-group">
        <label for="euros" class="block text-gray-700 font-medium mb-2">Quantidade de Euros:</label>
        <input type="number" id="euros" v-model="euros" @blur="validateEuros" min="1" max="100" required
          class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <div v-if="errors.euros" class="text-red-500 text-sm mt-1">{{ errors.euros }}</div>
      </div>

      <button type="submit"
        class="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        Comprar
      </button>
    </form>

    <div v-if="message" class="mt-4 text-center text-gray-700">{{ message }}</div>
  </div>
</template>

<script setup>
import { usePurchaseStore } from '@/components/coins/purchaseStore';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useTransactionsStore } from '@/stores/transactions';
import { useErrorStore } from '@/stores/error';

const purchaseStore = usePurchaseStore();
const { paymentType, paymentReference, euros, message, errors } = storeToRefs(purchaseStore);
const { validatePaymentType, validatePaymentReference, validateEuros, purchaseBrainCoins } = purchaseStore;

const transactionsStore = useTransactionsStore();
const authStore = useAuthStore();
const errorStore = useErrorStore();

const handlePurchase = async () => {
  // First validate the fields
  const isPaymentTypeValid = validatePaymentType();
  const isPaymentReferenceValid = validatePaymentReference();
  const isEurosValid = validateEuros();

  if (!isPaymentTypeValid || !isPaymentReferenceValid || !isEurosValid) {
    return;
  }

  try {
    // Construct the payload
    const payload = {
      transaction_datetime: new Date().toISOString(), // Current datetime
      user_id: authStore.user.id, // Replace with actual user ID if available
      type: 'P',
      euros: euros.value,
      brain_coins: Math.floor(euros.value * 10), // Example conversion rate: 1 Euro = 10 Brain Coins
      payment_type: paymentType.value,
      payment_reference: paymentReference.value,
    };

    // Call the transactions store's createTransaction method
    const response = await transactionsStore.createTransaction(payload);
    message.value = `Compra realizada com sucesso! ID da transação: ${response.data.id}`;
  } catch (error) {
    console.error('Error creating transaction:', error);
    errorStore.setErrorMessages('Erro ao processar a compra. Tente novamente mais tarde.');
  }
};
</script>