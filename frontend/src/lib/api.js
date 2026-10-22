const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Centralized API client helper for backend requests
export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = { ...options.headers };

  const isFormData = options.body instanceof FormData;

  if (options.body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body && !isFormData ? JSON.stringify(options.body) : options.body,
  });

  const data = await res.json().catch(() => ({}));

  const skipLogout = ["/auth/login", "/users/change-password"];

  if (res.status === 401 && !skipLogout.includes(path)) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  if (!res.ok) {
    throw new Error(data.message || "حدث خطأ غير متوقع");
  }

  return data;

  return data;
}
