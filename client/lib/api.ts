// Robust API helper to handle fetch errors and timeouts
export async function apiCall(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("API request timed out:", url);
      throw new Error("Request timed out");
    }

    console.error("API request failed:", url, error);
    throw error;
  }
}

// Specific helper for authenticated requests
export async function authenticatedApiCall(
  url: string,
  options: RequestInit = {},
) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("Not authenticated");
  }

  return apiCall(url, {
    ...options,
    headers: {
      ...options.headers,
      "X-User-Id": userId,
    },
  });
}
