import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

//const authStore = useAuthStore();

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    paymentType: 'MBWAY',
    paymentReference: '',
    euros: 1,
    message: '',
    errors: {
      paymentType: '',
      paymentReference: '',
      euros: '',
    },
  }),
  actions: {
    validatePaymentType() {
      if (!this.paymentType) {
        this.errors.paymentType = 'Tipo de pagamento é obrigatório.';
      } else {
        this.errors.paymentType = '';
      }
    },
    validatePaymentReference() {
      if (!this.paymentReference) {
        this.errors.paymentReference = 'Referência de pagamento é obrigatória.';
      } else {
        switch (this.paymentType) {
          case 'MBWAY':
            if (!/^\d{9}$/.test(this.paymentReference) || this.paymentReference.startsWith('90')) {
              this.errors.paymentReference = 'Referência de MBWAY inválida.';
            } else {
              this.errors.paymentReference = '';
            }
            break;
          case 'PAYPAL':
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.paymentReference) || this.paymentReference.startsWith('xx')) {
              this.errors.paymentReference = 'Referência de PAYPAL inválida.';
            } else {
              this.errors.paymentReference = '';
            }
            break;
          case 'IBAN':
            if (!/^[A-Z]{2}\d{23}$/.test(this.paymentReference) || this.paymentReference.startsWith('XX')) {
              this.errors.paymentReference = 'Referência de IBAN inválida.';
            } else {
              this.errors.paymentReference = '';
            }
            break;
          case 'MB':
            if (!/^\d{5}-\d{9}$/.test(this.paymentReference) || this.paymentReference.startsWith('9')) {
              this.errors.paymentReference = 'Referência de MB inválida.';
            } else {
              this.errors.paymentReference = '';
            }
            break;
          case 'VISA':
            if (!/^\d{16}$/.test(this.paymentReference) || this.paymentReference.startsWith('40')) {
              this.errors.paymentReference = 'Referência de VISA inválida.';
            } else {
              this.errors.paymentReference = '';
            }
            break;
          default:
            this.errors.paymentReference = '';
        }
      }
    },
    validateEuros() {
      if (!this.euros || this.euros < 1 || this.euros > 100) {
        this.errors.euros = 'Valor deve ser um número inteiro entre 1 e 100.';
      } else {
        this.errors.euros = '';
      }
    },
    async purchaseBrainCoins() {
      this.validatePaymentType();
      this.validatePaymentReference();
      this.validateEuros();

      if (this.errors.paymentType || this.errors.paymentReference || this.errors.euros) {
        return;
      }

      try {
        await axios.post('/transactions/purchase', {
          payment_type: this.paymentType,
          payment_reference: this.paymentReference,
          euros: this.euros,
        });

        const authStore = useAuthStore();
        await authStore.updateUser();

        this.message = 'Compra realizada com sucesso!';
      } catch (error) {
        if (error.response.status === 422) {
          const errorMessage = error.response.data.message;
          this.message = errorMessage;
        } else {
          this.message = 'Erro ao realizar a compra.';
        }
      }
    },
  },
});