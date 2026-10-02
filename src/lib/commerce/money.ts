export function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatLabel(format: string): string {
  if (format === "pdf") return "PDF";
  if (format === "software") return "Software";
  return "Spreadsheet";
}
