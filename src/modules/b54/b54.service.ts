import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class B54Service {
  protected readonly customerPartnerId: string;
  protected readonly axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.B54_API,
      headers: {
        Authorization: process.env.B54_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    this.customerPartnerId = process.env.B54_CUSTOMER_PARTNER_ID;
  }

  getCustomerPartnerId() {
    return this.customerPartnerId;
  }

  async registerTransaction(transactions) {
    try {
      const { data } = await this.axiosInstance.post(
        `transactions/register`,
        transactions,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }

  async registerClient(client) {
    try {
      const { data } = await this.axiosInstance.post(
        `customer_partners/${this.customerPartnerId}/customers`,
        client,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }

  async fetchClients() {
    try {
      const { data } = await this.axiosInstance.get(
        `customer_partners/${this.customerPartnerId}/customers`,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }

  async bulkPayments(payments) {
    try {
      const { data } = await this.axiosInstance.post(
        `financing/bulk-payment`,
        payments,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }

  async lockboxWithdrawal(payload) {
    try {
      let { data } = await this.axiosInstance.post(
        `baas/customer-partner/${this.customerPartnerId}/withdraw`,
        payload,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }

  async fetchCurrentCreditLimit() {
    try {
      let { data } = await this.axiosInstance.get(
        `customer-partner/${this.customerPartnerId}/credit-limit/current`,
      );
      return { success: true, message: data?.message, data: data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message };
    }
  }
}
