/**
 * CSV Export Utility for Trendupp Admin Analytics & Reports
 */

export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][],
) {
  const escapeCsv = (val: string | number | boolean | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerRow = headers.map(escapeCsv).join(",");
  const dataRows = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const csvContent = `${headerRow}\n${dataRows}`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename.replace(/[^a-zA-Z0-9_-]/g, "_")}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
