<template>
    <div>
      <h2>Buy Brain Coins</h2>
      <form @submit.prevent="submitForm">
        <label>
          Euros:
          <input v-model="form.euros" type="number" min="1" required />
        </label>
        <label>
          Payment Type:
          <select v-model="form.payment_type" required>
            <option value="MBWAY">MBWAY</option>
            <option value="PAYPAL">PAYPAL</option>
            <option value="IBAN">IBAN</option>
            <option value="MB">MB</option>
            <option value="VISA">VISA</option>
          </select>
        </label>
        <label>
          Payment Reference:
          <input v-model="form.payment_reference" type="text" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  import transactionsAPI from '@/stores/transactions';
  
  export default {
    name: 'TransactionForm',
    data() {
      return {
        form: {
          euros: 1,
          payment_type: 'MBWAY',
          payment_reference: '',
        },
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await transactionsAPI.createTransaction(this.form);
          alert('Transaction successful!');
          this.$emit('transactionCreated', response.data); // Emite evento para atualizar a lista
        } catch (error) {
          console.error('Error creating transaction:', error);
          alert('Failed to create transaction.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;
  }
  
  button {
    width: fit-content;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  