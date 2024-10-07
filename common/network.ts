import axios, { isAxiosError } from "axios";

export class NetworkManager {
  private static instance: NetworkManager;

  private constructor() {}

  static getInstance() {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  async get(url: string) {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  }

  public static async handleLogin(docId: string) {
    try {
      const response = await axios.get(
        `http://localhost:8080/user/login?doc_id=${docId}`
      );
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Auth Error:", error.response?.data);
        throw error;
      }
      throw error;
    }
  }
}