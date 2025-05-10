// vue-project/src/api.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false, // Это необходимо, если вы хотите поддерживать сеансы
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getData() {
    return apiClient.get('/data');
  }
};
