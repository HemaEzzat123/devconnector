const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === "" ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "string" && value.trim().length === 0) ||
  (typeof value === "number" && isNaN(value)) ||
  (typeof value === "boolean" && !value);

module.exports = isEmpty;

