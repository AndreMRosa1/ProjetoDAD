<template>
    <div>
      <h2>Transactions</h2>
      <router-link to="/dashboard/transactions">Transaction List</router-link> |
      <router-link to="/dashboard/transactions/new">New Transaction</router-link>
  
      <!-- Este é o local onde as rotas filhas serão renderizadas -->
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'TransactionPage',
  };
  </script>
  