import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, HttpStatusCode } from "axios";
import { getBearerToken, handleClearSession, isAuthErrorMessageLoop } from "@/utils/authUtils.ts";
import { AuthError } from "@/constants/app_constants.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: {
    "Content-Type": "application/json" // Default content type for JSON requests
  },
  validateStatus: status => status >= 200 && status < 300
});

api.interceptors.request.use(
  config => {
    const token = getBearerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // IMPORTANT: For file uploads using FormData, Axios automatically sets
    // 'Content-Type': 'multipart/form-data; boundary=...'
    // So, we should NOT explicitly set 'Content-Type' for FormData in the config here,
    // as it might override the correct boundary set by Axios.
    // If you explicitly set it to 'multipart/form-data' without a boundary, it might cause issues.
    // It's best to let Axios handle it.
    // Remove the previous check for `config.data instanceof FormData` if it existed here,
    // as Axios handles it automatically and correctly.
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  <T>(response: AxiosResponse<BaseApiResponse<T>>) => response,
  async (error: AxiosError) => {
    console.log(error.status);
    if (error.response?.data instanceof Blob && error.status != HttpStatusCode.Ok) {
      const errorText = await error.response.data.text();
      let parsedError: BaseErrorResponse;
      try {
        parsedError = JSON.parse(errorText);
      } catch (jsonError) {
        parsedError = {
          error: {
            message: AuthError.unknown,
            code: ""
          }
        };
      }
      if (isAuthErrorMessageLoop(parsedError.error.message)) {
        handleClearSession(parsedError.error);
        return Promise.reject();
      }
    } else if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = (error.response.data as BaseErrorResponse).error;
      if (isAuthErrorMessageLoop(errorData.message)) {
        handleClearSession(errorData);
        return Promise.reject();
      }
      return Promise.reject(error.response.data as BaseErrorResponse);
    }
    return Promise.reject(error);
  }
);

export interface BaseApiResponse<T> {
  message: string;
  data?: T; // Make data optional, as it might be undefined for 204 or in error responses
  error?: ErrorResponse; // Make error optional, only present on error
}

// Adjusted to match potential server error response structure
interface BaseErrorResponse {
  error: ErrorResponse;
  meta?: string; // meta might be optional or not always present
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: string; // details might be optional or not always present
}

interface AxiosCRUD {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;

  post<T>(url: string, data?: any, config?: AxiosRequestConfig, isFollowFormat?: boolean): Promise<T>;

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const createApiService = (): AxiosCRUD => {
  return {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await api.get(url, config);
        // Handle 204 No Content or responses without data.data
        return response.data.data || response.data || (undefined as T);
      } catch (error) {
        // Ensure error is handled consistently. The interceptor should have rejected AxiosError or BaseErrorResponse.
        if (axios.isAxiosError(error) && error.response?.data) {
          throw (error.response.data as BaseErrorResponse).error;
        } else if (error && (error as BaseErrorResponse).error) {
          throw (error as BaseErrorResponse).error;
        }
        throw error; // Re-throw other types of errors
      }
    },

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await api.post(url, data, config);
        if (config?.responseType == "blob") {
          return { data: response.data, contentDisposition: response.headers["content-disposition"] } as T;
        }
        return response.data.data || response.data || (undefined as T);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw (error.response.data as BaseErrorResponse).error;
        } else if (error && (error as BaseErrorResponse).error) {
          throw (error as BaseErrorResponse).error;
        }
        throw error;
      }
    },

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await api.put(url, data, config);
        return response.data.data || response.data || (undefined as T);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw (error.response.data as BaseErrorResponse).error;
        } else if (error && (error as BaseErrorResponse).error) {
          throw (error as BaseErrorResponse).error;
        }
        throw error;
      }
    },

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      try {
        const response = await api.delete(url, config);
        return response.data.data || response.data || (undefined as T);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw (error.response.data as BaseErrorResponse).error;
        } else if (error && (error as BaseErrorResponse).error) {
          throw (error as BaseErrorResponse).error;
        }
        throw error;
      }
    }
  };
};

export const service = createApiService();
