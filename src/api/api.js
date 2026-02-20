const API_URL = "https://swapi.info/api/";

export async function fetchRequest(endpoint) {
  try {
    const result = await apiRequest(API_URL + endpoint);
    localStorage.setItem(endpoint, JSON.stringify(result));
    return result;

  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Failed to fetch ${endpoint}:", error);
      return JSON.parse(localStorage.getItem(endpoint)) || [];
    }
    else {
      throw error;
    }
  }
}

export async function apiRequest(requestUrl, options = {}) {
  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
    const responseData = await response.json();
    return responseData;
}
