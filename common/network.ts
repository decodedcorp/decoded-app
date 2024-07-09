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

  public static async login(credentials: {
    username: string;
    password: string;
  }) {
    try {
      const response = await axios.post(
        "http://localhost:8080/admin/login",
        credentials
      );
      // Store token in local storage
      localStorage.setItem("token", response.data.access_token);
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Auth Error:", error.response?.data);
        throw error;
      }
      throw error;
    }
  }
}
