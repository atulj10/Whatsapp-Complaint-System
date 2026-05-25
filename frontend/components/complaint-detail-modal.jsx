"use client";
import { useState } from "react";
import { useComplaint, useUpdateStatus } from "../hooks/use-complaints";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Dialog } from "./ui/dialog";
import { Spinner } from "./ui/spinner";

const statuses = ["Pending", "In Progress", "Escalated", "Resolved", "Rejected"];

export function ComplaintDetailModal({ complaintId, onClose }) {
  const { data: complaint, isLoading } = useComplaint(complaintId);
  const updateStatus = useUpdateStatus();
  const [status, setStatus] = useState("");
  const [adminRemark, setAdminRemark] = useState("");

  if (isLoading) {
    return (
      <Dialog open={true} onClose={onClose} title="Loading...">
        <Spinner />
      </Dialog>
    );
  }

  if (!complaint) return null;

  const handleUpdate = async () => {
    if (!status) return;
    await updateStatus.mutateAsync({
      id: complaint.id,
      status,
      ...(adminRemark.trim() ? { adminRemark: adminRemark.trim() } : {}),
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} title={`Complaint #${complaint.id}`}>
      <div className="space-y-4">
        {complaint.imageUrl && (
          <img
            src={complaint.imageUrl}
            alt="Complaint"
            className="w-full rounded-lg object-cover max-h-64"
          />
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Status</span>
            <div className="mt-1"><Badge>{complaint.status}</Badge></div>
          </div>
          <div>
            <span className="text-gray-500">Circle</span>
            <p className="font-medium">{complaint.circle?.name || "Not assigned"}</p>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Remark</span>
            <p className="font-medium">{complaint.remark || "No description"}</p>
          </div>
          {complaint.adminRemark && (
            <div className="col-span-2">
              <span className="text-gray-500">Admin Remark</span>
              <p className="font-medium">{complaint.adminRemark}</p>
            </div>
          )}
          {complaint.location && (
            <>
              <div className="col-span-2">
                <span className="text-gray-500">Address</span>
                <p className="font-medium">{complaint.location.formattedAddress || "Not available"}</p>
              </div>
              <div>
                <span className="text-gray-500">Latitude</span>
                <p className="font-medium">{complaint.location.latitude}</p>
              </div>
              <div>
                <span className="text-gray-500">Longitude</span>
                <p className="font-medium">{complaint.location.longitude}</p>
              </div>
            </>
          )}
          <div>
            <span className="text-gray-500">Phone</span>
            <p className="font-medium">{complaint.phoneNumber}</p>
          </div>
          <div>
            <span className="text-gray-500">Created</span>
            <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <hr className="my-4" />

        <h3 className="font-semibold">Update Status</h3>
        <div className="space-y-3">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status...</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Input
            placeholder="Optional admin remark..."
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleUpdate}
              disabled={!status || updateStatus.isPending}
            >
              {updateStatus.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
