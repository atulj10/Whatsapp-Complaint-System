"use client";
import { useCircles } from "../hooks/use-circles";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

export function ComplaintFilters({ filters, onChange }) {
  const { data: circles } = useCircles();

  const handle = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="w-48">
        <Select
          value={filters.status || ""}
          onChange={(e) => handle("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </Select>
      </div>
      <div className="w-48">
        <Select
          value={filters.circleId || ""}
          onChange={(e) => handle("circleId", e.target.value)}
        >
          <option value="">All Circles</option>
          {circles?.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </div>
      <div className="w-64">
        <Input
          placeholder="Search complaints..."
          value={filters.search || ""}
          onChange={(e) => handle("search", e.target.value)}
        />
      </div>
    </div>
  );
}
