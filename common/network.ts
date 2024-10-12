import axios, { isAxiosError } from "axios";
import { convertKeysToSnakeCase } from "@/components/helpers/util";

/**
    * @class NetworkManager
 * @description Singleton class for network management
*/
export class NetworkManager {
  private static instance: NetworkManager;
    private readonly config: {
        /**
            * @property {string} db - Database endpoint root URL
        */
        db: string;
        /**
            * @property {string} storage - Storage endpoint root URL
        */
        storage: string;
    };

    private constructor() {
        const is_prod = process.env.NODE_ENV === "production";
        if (is_prod) {
            if (process.env.NEXT_PUBLIC_DB_ENDPOINT === undefined || process.env.NEXT_PUBLIC_STORAGE_ENDPOINT === undefined) {
                throw new Error("Environment variable is undefined");
            }
        } else {
            if (process.env.NEXT_PUBLIC_LOCAL_DB_ENDPOINT === undefined || process.env.NEXT_PUBLIC_LOCAL_STORAGE_ENDPOINT === undefined) {
                throw new Error("Environment variable is undefined");
            }
        }
        this.config = {
            db: is_prod ? process.env.NEXT_PUBLIC_DB_ENDPOINT! : process.env.NEXT_PUBLIC_LOCAL_DB_ENDPOINT!,
            storage: is_prod ? process.env.NEXT_PUBLIC_STORAGE_ENDPOINT! : process.env.NEXT_PUBLIC_LOCAL_STORAGE_ENDPOINT!,
        };
    }

    public static getInstance(): NetworkManager {
        if (!NetworkManager.instance) {
            NetworkManager.instance = new NetworkManager();
        }
        return NetworkManager.instance;
    }

    public async handleCreateDoc(collectionName: string, data: any) {
        const convertedData = convertKeysToSnakeCase(data);
        const url = `${this.config.db}/${collectionName}/upload`;
        const res = await axios.post(url, convertedData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res;
    }

    public async uploadDataToStorage(file: string) {
        const url = `${this.config.storage}?file=${file}`;
        const res = await axios.post(url);
        return res;
    }
}

export const networkManager = NetworkManager.getInstance();