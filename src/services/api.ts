const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("usami_token", token);
  } else {
    localStorage.removeItem("usami_token");
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("usami_token");
  }
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de conexión" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    tenantId: string;
  };
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(data.access_token);
  return data;
}

export function logout() {
  setAuthToken(null);
}

// ─── Students ───

export async function getStudents(courseId?: string) {
  const query = courseId ? `?courseId=${courseId}` : "";
  return request<any[]>(`/students${query}`);
}

export async function getStudentById(id: string) {
  return request<any>(`/students/${id}`);
}

export async function createStudent(data: {
  rut: string;
  firstName: string;
  lastName: string;
  motherLastName: string;
  birthDate: string;
  gender: string;
  courseId?: string;
}) {
  return request<any>("/students", { method: "POST", body: JSON.stringify(data) });
}

export async function updateStudent(id: string, data: Record<string, any>) {
  return request<any>(`/students/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Courses ───

export async function getCourses() {
  return request<any[]>("/courses");
}

export async function getCourseById(id: string) {
  return request<any>(`/courses/${id}`);
}

export async function createCourse(data: {
  officialLevel: string;
  creativeName?: string;
  year: number;
  capacity: number;
}) {
  return request<any>("/courses", { method: "POST", body: JSON.stringify(data) });
}

export async function updateCourse(id: string, data: Record<string, any>) {
  return request<any>(`/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function getCourseStudents(courseId: string) {
  return request<any[]>(`/courses/${courseId}/students`);
}

// ─── Users ───

export async function getUsers(tenantId?: string) {
  const query = tenantId ? `?tenantId=${tenantId}` : "";
  return request<any[]>(`/users${query}`);
}

export async function getUserById(id: string) {
  return request<any>(`/users/${id}`);
}

export async function createUser(data: {
  email: string;
  password: string;
  fullName: string;
  rut: string;
  role: string;
  tenantId?: string;
}) {
  return request<any>("/users", { method: "POST", body: JSON.stringify(data) });
}

export async function updateUser(id: string, data: Record<string, any>) {
  return request<any>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Tenants ───

export async function getTenants() {
  return request<any[]>("/tenants");
}

export async function getTenantById(id: string) {
  return request<any>(`/tenants/${id}`);
}

export async function createTenant(data: {
  name: string;
  rbd: string;
  address: string;
  comuna: string;
  region: string;
  phone: string;
  email: string;
  modality?: string;
  plan?: string;
}) {
  return request<any>("/tenants", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTenant(id: string, data: Record<string, any>) {
  return request<any>(`/tenants/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function getTenantFeatures(tenantId: string) {
  return request<any[]>(`/tenants/${tenantId}/features`);
}

export async function toggleTenantFeature(tenantId: string, moduleKey: string, enabled: boolean) {
  return request<any>(`/tenants/${tenantId}/features`, {
    method: "POST",
    body: JSON.stringify({ moduleKey, enabled }),
  });
}

// ─── Health Check ───

export async function checkApiHealth(): Promise<boolean> {
  try {
    await fetch(`${API_URL}/auth/login`, { method: "OPTIONS" });
    return true;
  } catch {
    return false;
  }
}
