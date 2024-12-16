<template>
    <div class="purchase-brain-coins">
      <h1>Compra de Brain Coins</h1>
      <form @submit.prevent="purchaseBrainCoins">
        <div class="form-group">
          <label for="paymentType">Tipo de Pagamento:</label>
          <select id="paymentType" v-model="paymentType" @blur="validatePaymentType">
            <option value="MBWAY">MBWAY</option>
            <option value="PAYPAL">PAYPAL</option>
            <option value="IBAN">IBAN</option>
            <option value="MB">MB</option>
            <option value="VISA">VISA</option>
          </select>
          <div v-if="errors.paymentType" class="error-message">{{ errors.paymentType }}</div>
        </div>
        <div class="form-group">
          <label for="paymentReference">Referência de Pagamento:</label>
          <input type="text" id="paymentReference" v-model="paymentReference" @blur="validatePaymentReference" required>
          <div v-if="errors.paymentReference" class="error-message">{{ errors.paymentReference }}</div>
        </div>
        <div class="form-group">
          <label for="euros">Quantidade de Euros:</label>
          <input type="number" id="euros" v-model="euros" @blur="validateEuros" min="1" max="100" required>
          <div v-if="errors.euros" class="error-message">{{ errors.euros }}</div>
        </div>
        <button type="submit">Comprar</button>
      </form>
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </template>
  
  <script setup>
  import { usePurchaseStore } from '@/components/coins/purchaseStore';
  import { storeToRefs } from 'pinia';
  
  const purchaseStore = usePurchaseStore();
  const { paymentType, paymentReference, euros, message, errors } = storeToRefs(purchaseStore);
  const { validatePaymentType, validatePaymentReference, validateEuros, purchaseBrainCoins } = purchaseStore;
  </script>
  
  <style scoped>
  .purchase-brain-coins {
    max-width: 500px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  input, select {
    width: 100%;
    height: 40px;
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    height: 40px;
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #3e8e41;
  }
  
  .message {
    margin-top: 20px;
    color: #666;
  }
  
  .error-message {
    color: red;
    font-size: 12px;
    margin-top: 5px;
  }
  </style>