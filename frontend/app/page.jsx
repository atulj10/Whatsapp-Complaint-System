"use client";
import { useState, useCallback, useEffect } from "react";
import { useComplaints } from "../hooks/use-complaints";
import { ComplaintFilters } from "../components/complaint-filters";
import { ComplaintsTable } from "../components/complaints-table";
import { ComplaintDetailModal } from "../components/complaint-detail-modal";
import { Pagination } from "../components/pagination";
import { Spinner } from "../components/ui/spinner";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "",
    circleId: "",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  });

  const [selectedId, setSelectedId] = useState(null);
  const [debounced, setDebounced] = useState(filters);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading, isError, error } = useComplaints(debounced);

  const handleFilterChange = useCallback((next) => {
    setFilters(next);
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLimitChange = useCallback((limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy, order) => {
    setFilters((prev) => ({ ...prev, sortBy, order, page: 1 }));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Complaint Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Patna Municipal Corporation — WhatsApp Complaint Management
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <ComplaintFilters filters={filters} onChange={handleFilterChange} />

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-600 font-medium">Failed to load complaints</p>
            <p className="text-sm text-red-500 mt-1">{error?.message}</p>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500 font-medium">No complaints found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filters.search || filters.status || filters.circleId
                ? "Try adjusting your filters"
                : "No complaints have been registered yet"}
            </p>
          </div>
        ) : (
          <>
            <ComplaintsTable
              data={data?.data || []}
              sortBy={filters.sortBy}
              order={filters.order}
              onSort={handleSort}
              onSelect={(c) => setSelectedId(c.id)}
            />
            <Pagination
              page={data?.pagination?.page || 1}
              limit={data?.pagination?.limit || 20}
              totalPages={data?.pagination?.totalPages || 1}
              total={data?.pagination?.total || 0}
              onChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </main>

      {selectedId && (
        <ComplaintDetailModal
          complaintId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
