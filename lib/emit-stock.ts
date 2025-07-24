import axios, { AxiosInstance } from 'axios';

const SOCKET_URL = process.env.SOCKET_SERVICE_URL!;
if (!SOCKET_URL) {
  throw new Error('SOCKET_SERVICE_URL is not defined');
}

const http: AxiosInstance = axios.create({
  baseURL: SOCKET_URL,
  headers: { 'Content-Type': 'application/json' },
});

export async function emitStockUpdate(
  productId: string,
  newStock: number
): Promise<void> {
  try {
    console.log('Posting to:', SOCKET_URL + '/emit-stock');
    await http.post('/emit-stock', { productId, newStock });
  } catch (error: any) {
    console.error('[emitStockUpdate]', error?.response?.data || error.message);
  }
}
