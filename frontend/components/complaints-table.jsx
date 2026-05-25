"use client";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function SortHeader({ label, sortKey, sortBy, order, onSort }) {
  const active = sortBy === sortKey;
  return (
    <button
      className="inline-flex items-center gap-1 hover:text-gray-900"
      onClick={() => onSort(sortKey, active && order === "asc" ? "desc" : "asc")}
    >
      {label}
      {active ? (
        order === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
      ) : (
        <ArrowUpDown size={14} className="opacity-30" />
      )}
    </button>
  );
}

export function ComplaintsTable({ data, sortBy, order, onSort, onSelect }) {
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
        header: () => (
          <SortHeader
            label="Created"
            sortKey="createdAt"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        ),
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      },
      {
        header: () => (
          <SortHeader
            label="Updated"
            sortKey="updatedAt"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        ),
        accessorKey: "updatedAt",
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
    [sortBy, order, onSort, onSelect]
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
