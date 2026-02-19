const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  department: "all",
  page: 1,
  sortBy: "id",
  sortOrder: "asc",
};

const ALLOWED_STATUSES = new Set(["all", "Active", "Discharged", "Pending", "Cancelled"]);
const ALLOWED_SORT_ORDERS = new Set(["asc", "desc"]);
const ALLOWED_SORT_FIELDS = new Set([
  "id",
  "patientId",
  "patientName",
  "dateOfBirth",
  "diagnosis",
  "admissionDate",
  "dischargeDate",
  "status",
  "department",
]);

function normalizeStatus(value) {
  if (!value || !ALLOWED_STATUSES.has(value)) {
    return DEFAULT_FILTERS.status;
  }

  return value;
}

export function getDefaultFilters() {
  return DEFAULT_FILTERS;
}

export function readFiltersFromUrl(searchString) {
  const params = new URLSearchParams(searchString);
  const search = params.get("search") || DEFAULT_FILTERS.search;
  const status = normalizeStatus(params.get("status"));
  const department = params.get("department") || DEFAULT_FILTERS.department;
  const page = Number.parseInt(params.get("page"), 10) || DEFAULT_FILTERS.page;
  const sortBy = ALLOWED_SORT_FIELDS.has(params.get("sortBy"))
    ? params.get("sortBy")
    : DEFAULT_FILTERS.sortBy;
  const sortOrder = ALLOWED_SORT_ORDERS.has(params.get("sortOrder"))
    ? params.get("sortOrder")
    : DEFAULT_FILTERS.sortOrder;

  return {
    search,
    status,
    department,
    page,
    sortBy,
    sortOrder,
  };
}

export function createUrlSearchFromFilters(filters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.status && filters.status !== DEFAULT_FILTERS.status) {
    params.set("status", filters.status);
  }

  if (filters.department && filters.department !== DEFAULT_FILTERS.department) {
    params.set("department", filters.department);
  }

  if (filters.page && filters.page !== DEFAULT_FILTERS.page) {
    params.set("page", String(filters.page));
  }

  if (filters.sortBy && filters.sortBy !== DEFAULT_FILTERS.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortOrder && filters.sortOrder !== DEFAULT_FILTERS.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  return params.toString();
}
