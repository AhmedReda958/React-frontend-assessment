const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

function createAppError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

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

function getHttpErrorMessage(status, fallbackMessage) {
  const statusMessages = {
    400: "The request is invalid. Please check your inputs and try again.",
    404: "Requested resource was not found.",
    409: "A conflicting record already exists.",
    500: "Server error occurred. Please try again in a moment.",
  };

  return statusMessages[status] || fallbackMessage;
}

function parseApiError(error, fallbackMessage) {
  if (error.name === "AbortError") {
    return null;
  }

  if (typeof error.status === "number") {
    const message = error.message || getHttpErrorMessage(error.status, fallbackMessage);
    return createAppError(message, error.status);
  }

  if (error instanceof TypeError) {
    return createAppError(
      "Network connection issue. Please confirm the backend is running and try again."
    );
  }

  return createAppError(error.message || fallbackMessage);
}

async function parseJsonResponse(response, fallbackMessage) {
  let payload = null;

  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || getHttpErrorMessage(response.status, fallbackMessage);
    throw createAppError(message, response.status);
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

    throw parsedError;
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

    throw parsedError;
  }
}

export async function createRecord(recordPayload) {
  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordPayload),
    });

    return await parseJsonResponse(response, "Unable to create clinical record.");
  } catch (error) {
    const parsedError = parseApiError(error, "Unable to create clinical record.");

    if (parsedError === null) {
      throw new Error("Request was cancelled.");
    }

    throw parsedError;
  }
}
