import axios from 'axios';

export default {
  // Obter todas as transações
  getTransactions() {
    return axios.get('/api/transactions'); // Ajustado para incluir o prefixo da API
  },

  // Criar uma nova transação
  createTransaction(data) {
    return axios.post('/api/transactions', data); // Prefixo correto para criação
  },
};
