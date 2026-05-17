"use client"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

export function CsvExportButton({ filename, headers, rows, label }: {
  filename: string
  headers: string[]
  rows: string[][]
  label?: string
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => exportToCSV(filename, headers, rows)}
    >
      <Download className="w-3.5 h-3.5" />
      {label || "Export CSV"}
    </Button>
  )
}
