export function objectContainsSearch(obj, searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();

    return Object.values(obj).some(value => {
        if (value == null) return false;

        // If value is a string
        if (typeof value === "string") {
            return value.toLowerCase().includes(lowerSearch);
        }

        // If value is an array (like films, residents, etc.)
        if (Array.isArray(value)) {
            return value.some(v =>
                typeof v === "string" &&
                v.toLowerCase().includes(lowerSearch)
            );
        }

        // If value is a number, allow search by string representation
        if (typeof value === "number") {
            return String(value).includes(lowerSearch);
        }
        return false;
    });
}

export function applyFilters(filters, data) {
    return filters.reduce((result, filter) => {
        return result.filter(item => {
            let value = item[filter.key];
            if (value == null) return false;

            // Handle arrays by joining them into a string
            if (Array.isArray(value)) {
                value = value.join(" ");
            }

            // Variables we may need
            const raw = String(value).replace(/,/g, "").toLowerCase();
            const compareValue = String(filter.value).toLowerCase();

            // For numeric compare
            const parsed = parseNumericValue(value);
            const numericValue = parsed ? parsed.avg : null;
            const filterNumber = Number(filter.value);

            switch (filter.type) {
                case "contains":
                    return raw.includes(compareValue);

                case "exact":
                    return raw === compareValue;

                case "compare":
                    if (numericValue == null || isNaN(filterNumber)) return false;
                    console.log(filter.operator)
                    switch (filter.operator) {
                        case ">":  return numericValue > filterNumber;
                        case "<":  return numericValue < filterNumber;
                        case "=":  return numericValue === filterNumber;
                        case ">=": return numericValue >= filterNumber;
                        case "<=": return numericValue <= filterNumber;
                        default:   return false;
                    }

                default:
                    return true;
            }
        });
    }, [...data]);
}

export function extractFilterableKeys(data) {
    if (!data || data.length === 0) return [];

    const sample = data[0];

    return Object.keys(sample)
        .filter(key => {
            const value = sample[key];

            // Ignore URLs or complex nested objects if desired
            if (typeof value === "object" && !Array.isArray(value)) {
                return false;
            }

            return true;
        });
}

export function detectFieldType(data, key) {
    if (!data || data.length === 0) return "string";

    for (let item of data) {
        let value = item[key];
        if (value == null) continue;

        // Arrays treated as strings
        if (Array.isArray(value)) return "string";

        // Convert to string and clean commas
        const cleaned = String(value).replace(/,/g, "").trim().toLowerCase();

        // Ignore placeholders
        if (["unknown", "n/a", "none"].includes(cleaned)) continue;

        // Check for ranges like "30-150"
        if (cleaned.includes("-")) {
            const parts = cleaned.split("-").map(p => Number(p.trim()));
            if (parts.every(n => !isNaN(n))) {
                return "number"; // treat ranges as numeric
            } else {
                return "string";
            }
        }

        // Check if numeric
        if (!isNaN(Number(cleaned))) return "number";

        // Otherwise treat as string
        return "string";
    }

    // Default fallback
    return "string";
}

function parseNumericValue(value) {
    if (value == null) return null;

    const str = String(value)
        .replace(/,/g, "")
        .trim()
        .toLowerCase();

    if (["unknown", "n/a", "none"].includes(str)) {
        return null;
    }

    // Range: "30-150"
    if (str.includes("-")) {
        const parts = str
            .split("-")
            .map(n => Number(n.trim()))
            .filter(n => !isNaN(n));

        if (parts.length === 2) {
            return {
                min: parts[0],
                max: parts[1],
                avg: (parts[0] + parts[1]) / 2
            };
        }
        return null;
    }

    const num = Number(str);
    if (!isNaN(num)) {
        return { min: num, max: num, avg: num };
    }

    return null;
}

export function sortByKey(key, data, direction = "asc") {
    return [...data].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];

        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        const parsedA = parseNumericValue(valA);
        const parsedB = parseNumericValue(valB);

        // Numeric sort if both parse successfully
        if (parsedA && parsedB) {
            return direction === "asc"
                ? parsedA.avg - parsedB.avg
                : parsedB.avg - parsedA.avg;
        }

        // STRING SORT (use original values!)
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        const comparison = strA.localeCompare(strB);

        return direction === "asc"
            ? comparison
            : -comparison;
    });
}