const DEFAULT_FILTERS = {
  search: "",
  status: "all",
  department: "all",
};

const ALLOWED_STATUSES = new Set(["all", "Active", "Discharged"]);

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

  return {
    search,
    status,
    department,
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

  return params.toString();
}
