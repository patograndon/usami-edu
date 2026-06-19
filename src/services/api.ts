const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

let authToken: string | null = null;
let activeTenantId: string | null = null;

export function setActiveTenant(tenantId: string | null) {
  activeTenantId = tenantId;
  if (tenantId) {
    localStorage.setItem("usami_active_tenant", tenantId);
  } else {
    localStorage.removeItem("usami_active_tenant");
  }
}

export function getActiveTenant(): string | null {
  if (activeTenantId) return activeTenantId;
  if (typeof window !== "undefined") {
    activeTenantId = localStorage.getItem("usami_active_tenant");
  }
  return activeTenantId;
}

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
  const tenant = getActiveTenant();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (tenant) {
    headers["X-Tenant-Id"] = tenant;
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
  setActiveTenant(null);
}

export async function getMyTenants(): Promise<{ id: string; name: string; rbd: string; comuna: string }[]> {
  return request("/auth/me/tenants");
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

// ─── Attendance ───

export async function getAttendanceByCourse(courseId: string, date?: string) {
  const query = date ? `?date=${date}` : "";
  return request<any[]>(`/attendance/course/${courseId}${query}`);
}

export async function getAttendanceByStudent(studentId: string) {
  return request<any[]>(`/attendance/student/${studentId}`);
}

export async function saveAttendance(data: Record<string, any>) {
  return request<any>("/attendance", { method: "POST", body: JSON.stringify(data) });
}

export async function bulkSaveAttendance(records: Record<string, any>[]) {
  return request<any[]>("/attendance/bulk", { method: "POST", body: JSON.stringify({ records }) });
}

// ─── Daily Log (Diario de Aula) ───

export async function getDailyLogsByCourse(courseId: string, date?: string) {
  const query = date ? `?date=${date}` : "";
  return request<any[]>(`/daily-logs/course/${courseId}${query}`);
}

export async function createDailyLog(data: Record<string, any>) {
  return request<any>("/daily-logs", { method: "POST", body: JSON.stringify(data) });
}

export async function approveDailyLog(id: string, status: "APPROVED" | "REJECTED") {
  return request<any>(`/daily-logs/${id}/approve`, { method: "PATCH", body: JSON.stringify({ status }) });
}

// ─── Evaluations ───

export async function getEvaluations(courseId?: string) {
  const query = courseId ? `?courseId=${courseId}` : "";
  return request<any[]>(`/evaluations${query}`);
}

export async function createEvaluation(data: Record<string, any>) {
  return request<any>("/evaluations", { method: "POST", body: JSON.stringify(data) });
}

export async function updateEvaluation(id: string, data: Record<string, any>) {
  return request<any>(`/evaluations/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Clinical / Decreto 170 ───

export async function getClinicalProfiles() {
  return request<any[]>("/clinical/profiles");
}

export async function getClinicalProfileByStudent(studentId: string) {
  return request<any>(`/clinical/profiles/student/${studentId}`);
}

export async function getClinicalSessions(studentId?: string) {
  const query = studentId ? `?studentId=${studentId}` : "";
  return request<any[]>(`/clinical/sessions${query}`);
}

export async function createClinicalSession(data: Record<string, any>) {
  return request<any>("/clinical/sessions", { method: "POST", body: JSON.stringify(data) });
}

export async function getFueiRecords() {
  return request<any[]>("/clinical/fuei");
}

export async function createFuei(data: Record<string, any>) {
  return request<any>("/clinical/fuei", { method: "POST", body: JSON.stringify(data) });
}

export async function updateFuei(id: string, data: Record<string, any>) {
  return request<any>(`/clinical/fuei/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Calendar ───

export async function getEvents() {
  return request<any[]>("/events");
}

export async function createEvent(data: Record<string, any>) {
  return request<any>("/events", { method: "POST", body: JSON.stringify(data) });
}

export async function updateEvent(id: string, data: Record<string, any>) {
  return request<any>(`/events/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export async function deleteEvent(id: string) {
  return request<any>(`/events/${id}`, { method: "DELETE" });
}

// ─── Communications ───

export async function getCommunications() {
  return request<any[]>("/communications");
}

export async function createCommunication(data: Record<string, any>) {
  return request<any>("/communications", { method: "POST", body: JSON.stringify(data) });
}

// ─── Notifications ───

export async function getNotifications() {
  return request<any[]>("/notifications");
}

export async function createNotification(data: Record<string, any>) {
  return request<any>("/notifications", { method: "POST", body: JSON.stringify(data) });
}

export async function markNotificationRead(id: string) {
  return request<any>(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function getNotificationTemplates() {
  return request<any[]>("/notifications/templates");
}

export async function getDeviceTokens() {
  return request<any[]>("/notifications/devices");
}

// ─── Chat ───

export async function getChatConversations() {
  return request<any[]>("/chat/conversations");
}

export async function getChatMessages(conversationId: string) {
  return request<any[]>(`/chat/conversations/${conversationId}/messages`);
}

export async function sendChatMessage(conversationId: string, body: string, imageUrl?: string) {
  return request<any>(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, imageUrl }),
  });
}

export async function createChatConversation(participantIds: string[], relatedStudentId?: string) {
  return request<any>("/chat/conversations", {
    method: "POST",
    body: JSON.stringify({ participantIds, relatedStudentId }),
  });
}

// ─── Nutrition ───

export async function getMenus() {
  return request<any[]>("/nutrition/menus");
}

export async function createMenu(data: Record<string, any>) {
  return request<any>("/nutrition/menus", { method: "POST", body: JSON.stringify(data) });
}

export async function updateMenu(id: string, data: Record<string, any>) {
  return request<any>(`/nutrition/menus/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Staff Attendance (HR) ───

export async function getStaffAttendance(date?: string) {
  const query = date ? `?date=${date}` : "";
  return request<any[]>(`/staff-attendance${query}`);
}

export async function staffCheckIn(data: Record<string, any>) {
  return request<any>("/staff-attendance/check-in", { method: "POST", body: JSON.stringify(data) });
}

export async function staffCheckOut(data: Record<string, any>) {
  return request<any>("/staff-attendance/check-out", { method: "POST", body: JSON.stringify(data) });
}

// ─── Receipts (Finance) ───

export async function getReceipts() {
  return request<any[]>("/receipts");
}

export async function createReceipt(data: Record<string, any>) {
  return request<any>("/receipts", { method: "POST", body: JSON.stringify(data) });
}

export async function updateReceipt(id: string, data: Record<string, any>) {
  return request<any>(`/receipts/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

// ─── Security ───

export async function getSecurityLogs() {
  return request<any[]>("/security/logs");
}

export async function createSecurityLog(data: Record<string, any>) {
  return request<any>("/security/logs", { method: "POST", body: JSON.stringify(data) });
}

export async function getRetirements() {
  return request<any[]>("/security/retirements");
}

export async function createRetirement(data: Record<string, any>) {
  return request<any>("/security/retirements", { method: "POST", body: JSON.stringify(data) });
}

// ─── Audit Logs ───

export async function getAuditLogs(tenantId?: string) {
  const query = tenantId ? `?tenantId=${tenantId}` : "";
  return request<any[]>(`/audit-logs${query}`);
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
