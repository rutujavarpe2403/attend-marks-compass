
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EmptyState } from "./EmptyState";
import { Search } from "lucide-react";

interface Column {
  header: string;
  accessorKey: string;
  cell?: (props: { row: { original: Record<string, any> } }) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  searchable?: boolean;
}

export const DataTable = ({
  columns,
  data,
  searchable = false,
}: DataTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = searchable
    ? data.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data;

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

      {filteredData.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.accessorKey}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="No results found"
          description={searchable ? "Try adjusting your search query." : "No data available."}
        />
      )}
    </div>
  );
};
