// Property prices are in Bangladeshi Taka. Numbers get South Asian (lakh/crore)
// grouping, e.g. 12000000 -> "৳1,20,00,000"; non-numeric text is shown as-is.
export const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") return "N/A";
  const raw = String(price).replace(/,/g, "").trim();
  const value = Number(raw);
  if (raw !== "" && !Number.isNaN(value)) {
    return `৳${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  }
  return String(price); // e.g. "Negotiable"
};
