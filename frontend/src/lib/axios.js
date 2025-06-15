import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Dodanie interceptora odpowiedzi
axiosInstance.interceptors.response.use(
  // Dla udanych odpowiedzi (2xx) po prostu zwróć dane
  (response) => response,

  // Dla wszystkich błędów (4xx, 5xx) rzuć wyjątek z dodatkowymi informacjami
  (error) => {
    // Jeśli mamy odpowiedź od serwera
    if (error.response) {
      // Możesz wzbogacić obiekt błędu o dodatkowe informacje
      const enhancedError = new Error(error.response.data?.message || "An error occurred");
      enhancedError.status = error.response.status;
      enhancedError.data = error.response.data;
      enhancedError.originalError = error;
      enhancedError.message = error.response.data?.message || "An error occurred while processing your request";

      // Wypisz szczegóły błędu do konsoli (pomocne przy debugowaniu)
      console.error("API Error:", {
        status: error.response.status,
        url: error.config.url,
        method: error.config.method,
        data: error.response.data,
      });

      return Promise.reject(enhancedError);
    }

    // Jeśli żądanie zostało wykonane, ale nie otrzymano odpowiedzi
    if (error.request) {
      const networkError = new Error("No response received from server. Check your network connection.");
      networkError.originalError = error;
      return Promise.reject(networkError);
    }

    // Coś się stało podczas tworzenia żądania
    const requestError = new Error("Error setting up the request: " + error.message);
    requestError.originalError = error;
    return Promise.reject(requestError);
  }
);
