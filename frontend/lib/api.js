const BASE = "/api";

async function request(url, options = {}) {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function fetchComplaints(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") q.set(k, v);
  });
  return request(`/complaints?${q}`);
}

export function fetchComplaint(id) {
  return request(`/complaints/${id}`);
}

export function updateComplaintStatus(id, data) {
  return request(`/complaints/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchCircles() {
  return request("/circles");
}
