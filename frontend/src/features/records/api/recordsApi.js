const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.status && filters.status !== "all") {
    params.set("status", filters.status);
  }

  if (filters.department && filters.department !== "all") {
    params.set("department", filters.department);
  }

  return params.toString();
}

function parseApiError(error, fallbackMessage) {
  if (error.name === "AbortError") {
    return null;
  }

  return error.message || fallbackMessage;
}

async function parseJsonResponse(response, fallbackMessage) {
  let payload = null;

  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || fallbackMessage;
    throw new Error(message);
  }

  return payload;
}

export async function fetchRecords(filters, signal) {
  try {
    const queryString = buildQueryString(filters);
    const requestUrl = queryString
      ? `${API_BASE_URL}/records?${queryString}`
      : `${API_BASE_URL}/records`;
    const response = await fetch(requestUrl, { signal });
    const payload = await parseJsonResponse(
      response,
      "Unable to load clinical records. Please try again."
    );

    return Array.isArray(payload) ? payload : payload?.data || [];
  } catch (error) {
    const parsedError = parseApiError(
      error,
      "Unable to load clinical records. Please try again."
    );

    if (parsedError === null) {
      return null;
    }

    throw new Error(parsedError);
  }
}

export async function fetchDepartments(signal) {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, { signal });
    const payload = await parseJsonResponse(
      response,
      "Unable to load departments. Please try again."
    );

    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    const parsedError = parseApiError(error, "Unable to load departments.");

    if (parsedError === null) {
      return null;
    }

    throw new Error(parsedError);
  }
}
