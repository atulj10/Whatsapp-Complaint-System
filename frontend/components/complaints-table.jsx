"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function ComplaintsTable({ data, onSelect }) {
  const [sorting, setSorting] = useState({ sortBy: "createdAt", order: "desc" });

  const columns = useMemo(
    () => [
      {
        header: "Image",
        accessorKey: "imageUrl",
        cell: ({ getValue }) => {
          const url = getValue();
          return url ? (
            <img
              src={url}
              alt="complaint"
              className="h-10 w-10 rounded object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              No
            </div>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
      },
      {
        header: "Circle",
        accessorKey: "circle",
        cell: ({ getValue }) => {
          const c = getValue();
          return c ? c.code : "-";
        },
      },
      {
        header: "Address",
        accessorKey: "location",
        cell: ({ getValue }) => {
          const loc = getValue();
          return loc?.formattedAddress
            ? loc.formattedAddress.length > 50
              ? loc.formattedAddress.slice(0, 50) + "..."
              : loc.formattedAddress
            : "-";
        },
      },
      {
        header: "Phone",
        accessorKey: "phoneNumber",
        cell: ({ getValue }) => getValue(),
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelect(row.original)}
          >
            View
          </Button>
        ),
      },
    ],
    [onSelect]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
