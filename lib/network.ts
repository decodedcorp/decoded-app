class NetworkManager {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Network request failed:', error);
      throw error;
    }
  }
}

export const networkManager = new NetworkManager(); 