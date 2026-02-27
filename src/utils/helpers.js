export function uniqueValues(items, key) {
  return [...new Set(items.map((item) => item[key]).filter(Boolean))];
}

export function formatSalary(min, max) {
  if (!min && !max) {
    return "Salary not specified";
  }

  if (min && max) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }

  return min ? `From $${min.toLocaleString()}` : `Up to $${max.toLocaleString()}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
