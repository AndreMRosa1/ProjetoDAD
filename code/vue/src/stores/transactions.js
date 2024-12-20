import axios from 'axios';

export default {
  // Obter todas as transações
  getTransactions() {
    return axios.get('/transactions'); // Ajustado para incluir o prefixo da API
  },

  // Criar uma nova transação
  createTransaction(data) {
    return axios.post('/transactions', data); // Prefixo correto para criação
  },
};
