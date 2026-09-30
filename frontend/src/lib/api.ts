export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      if (envUrl && (envUrl.includes('localhost:3001') || envUrl.includes('127.0.0.1:3001'))) {
        return `${window.location.protocol}//${host}:3001/api/v1`;
      }
    }
  }
  return envUrl || 'http://localhost:3001/api/v1';
}

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('devascent_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // sends httpOnly cookies
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMsg = 'An unexpected error occurred';
      if (typeof data?.message === 'string') {
        errorMsg = data.message;
      } else if (Array.isArray(data?.message)) {
        errorMsg = data.message.map((m: any) => (typeof m === 'string' ? m : (m?.message || JSON.stringify(m)))).join(', ');
      } else if (data?.message && typeof data.message === 'object') {
        errorMsg = data.message.message || JSON.stringify(data.message);
      } else if (typeof data?.error === 'string') {
        errorMsg = data.error;
      } else if (data?.error && typeof data.error === 'object') {
        errorMsg = data.error.message || JSON.stringify(data.error);
      } else if (response.statusText) {
        errorMsg = `Server error (${response.status}: ${response.statusText})`;
      }
      const error: any = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    throw err;
  }
}

function buildQuery(params?: Record<string, any>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'ALL') {
      searchParams.append(key, String(value));
    }
  }
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

export const api = {
  // Auth
  register: (userData: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  verifyOtp: (email: string, code: string) => fetchApi('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) }),
  sendOtp: (email: string, name?: string) => fetchApi('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email, name }) }),
  login: (credentials: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  googleAuth: (tokenOrCredential: string) => fetchApi('/auth/google', { method: 'POST', body: JSON.stringify({ token: tokenOrCredential, credential: tokenOrCredential }) }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getProfile: () => fetchApi('/auth/profile'),
  updateProfile: (data: any) => fetchApi('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: { currentPassword: string; newPassword: string }) => fetchApi('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),

  // Courses & Internships
  getCourses: (params?: { domain?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchApi(`/courses${query ? `?${query}` : ''}`);
  },
  getCourseBySlug: (slug: string) => fetchApi(`/courses/${slug}`),
  enrollFree: (slug: string) => fetchApi(`/courses/${slug}/enroll-free`, { method: 'POST' }),
  applyCohort: (slug: string, note?: string) => fetchApi(`/courses/${slug}/apply`, { method: 'POST', body: JSON.stringify({ note }) }),

  // Progress & Enrollments
  getMyEnrollments: () => fetchApi('/me/enrollments'),
  getMyStats: () => fetchApi('/me/stats'),
  getCourseProgress: (courseId: string) => fetchApi(`/progress/${courseId}`),
  completeLesson: (courseId: string, lessonId: string) => fetchApi(`/progress/${courseId}/lessons/${lessonId}/complete`, { method: 'POST' }),
  submitQuiz: (courseId: string, answers: any) => fetchApi(`/progress/${courseId}/quiz`, { method: 'POST', body: JSON.stringify({ answers }) }),

  // Submissions (Completion & Graduation Form)
  submitCompletion: (data: {
    courseId: string;
    batch: string;
    projectName: string;
    gitRepoUrl: string;
    linkedinPostUrl: string;
  }) => fetchApi('/submissions', { method: 'POST', body: JSON.stringify(data) }),
  getMySubmissions: () => fetchApi('/submissions/my'),
  getAllSubmissions: (status?: string) => fetchApi(`/submissions/admin/all${status ? `?status=${status}` : ''}`),
  approveSubmission: (id: string, adminNote?: string) => fetchApi(`/submissions/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ adminNote }) }),
  rejectSubmission: (id: string, reason: string) => fetchApi(`/submissions/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),

  // Payments
  createOrder: (courseId: string, couponCode?: string, studentDetails?: any) =>
    fetchApi('/payments/create-order', { method: 'POST', body: JSON.stringify({ courseId, couponCode, studentDetails }) }),
  verifyPayment: (paymentData: any) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Certificates
  getMyCertificates: () => fetchApi('/certificates/my'),
  getCertificate: (courseId: string) => fetchApi(`/certificates/me/${courseId}`),
  verifyCertificatePublic: (certId: string) => fetchApi(`/verify/${certId}`),
  getDownloadUrl: (certId: string) => `${getApiBaseUrl()}/certificates/${certId}/download`,

  // Refunds
  requestRefund: (refundData: { orderId: string; reason: string; upiId?: string }) => fetchApi('/refunds/apply', { method: 'POST', body: JSON.stringify(refundData) }),
  getRefundStatus: (refundId: string) => fetchApi(`/refunds/status/${refundId}`),

  // ─── Admin ───────────────────────────────────────────────────────────────────
  admin: {
    getOverview: () => fetchApi('/admin/overview'),
    getBadgeCounts: () => fetchApi('/admin/badge-counts'),
    getHealth: () => fetchApi('/admin/health'),


    getStudents: (params?: { page?: number; limit?: number; search?: string; degree?: string; status?: string; emailVerified?: string; courseId?: string }) => {
      return fetchApi(`/admin/students${buildQuery(params)}`);
    },
    getStudentDetail: (id: string) => fetchApi(`/admin/students/${id}`),
    suspendStudent: (id: string, reason: string) =>
      fetchApi(`/admin/students/${id}/suspend`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
    restoreStudent: (id: string) =>
      fetchApi(`/admin/students/${id}/restore`, { method: 'PATCH' }),
    verifyStudentEmail: (id: string) =>
      fetchApi(`/admin/students/${id}/verify-email`, { method: 'PATCH' }),
    enrollStudentManual: (id: string, courseId: string) =>
      fetchApi(`/admin/students/${id}/enroll`, { method: 'POST', body: JSON.stringify({ courseId }) }),
    updateStudentNote: (id: string, note: string) =>
      fetchApi(`/admin/students/${id}/note`, { method: 'PATCH', body: JSON.stringify({ note }) }),

    // Payments
    getPayments: (params?: { page?: number; limit?: number; search?: string; status?: string; courseId?: string; cohort?: string; emailVerified?: string }) => {
      return fetchApi(`/admin/payments${buildQuery(params)}`);
    },

    getRefunds: (status?: string) =>
      fetchApi(`/admin/refunds${status && status !== 'ALL' ? `?status=${status}` : ''}`),
    approveRefund: (id: string) =>
      fetchApi(`/admin/refunds/${id}/approve`, { method: 'POST' }),
    rejectRefund: (id: string, reason: string) =>
      fetchApi(`/admin/refunds/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),

    getSubmissions: (params?: { status?: string; page?: number; limit?: number }) => {
      return fetchApi(`/admin/submissions${buildQuery(params)}`);
    },
    approveSubmission: (id: string, adminNote?: string) =>
      fetchApi(`/admin/submissions/${id}/approve`, { method: 'POST', body: JSON.stringify({ adminNote }) }),
    rejectSubmission: (id: string, reason: string) =>
      fetchApi(`/admin/submissions/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
    bulkApproveSubmissions: (ids: string[]) =>
      fetchApi('/admin/submissions/bulk-approve', { method: 'POST', body: JSON.stringify({ ids }) }),

    getCourseStats: () => fetchApi('/admin/courses'),
    getAnalytics: () => fetchApi('/admin/analytics'),

    getAuditLog: (params?: { page?: number; limit?: number; action?: string }) => {
      return fetchApi(`/admin/audit-log${buildQuery(params)}`);
    },

    exportStudentsUrl: () => `${getApiBaseUrl()}/admin/export/students`,
    exportRevenueUrl: () => `${getApiBaseUrl()}/admin/export/revenue`,

    updateRole: (userId: string, role: string) =>
      fetchApi(`/admin/settings/role/${userId}`, { method: 'PATCH', body: JSON.stringify({ role }) }),

    // Curriculum & Lesson Studio
    getCurriculum: (slug: string) => fetchApi(`/admin/courses/${slug}/curriculum`),
    createModule: (slug: string, data: { title: string; description?: string; moduleNumber?: number }) =>
      fetchApi(`/admin/courses/${slug}/modules`, { method: 'POST', body: JSON.stringify(data) }),
    updateModule: (slug: string, moduleId: string, data: { title?: string; description?: string; moduleNumber?: number }) =>
      fetchApi(`/admin/courses/${slug}/modules/${moduleId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteModule: (slug: string, moduleId: string) =>
      fetchApi(`/admin/courses/${slug}/modules/${moduleId}`, { method: 'DELETE' }),
    createLesson: (slug: string, moduleId: string, data: any) =>
      fetchApi(`/admin/courses/${slug}/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(data) }),
    updateLesson: (slug: string, lessonId: string, data: any) =>
      fetchApi(`/admin/courses/${slug}/lessons/${lessonId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteLesson: (slug: string, lessonId: string) =>
      fetchApi(`/admin/courses/${slug}/lessons/${lessonId}`, { method: 'DELETE' }),
    upsertLessonQuiz: (slug: string, lessonId: string, data: any) =>
      fetchApi(`/admin/courses/${slug}/lessons/${lessonId}/quiz`, { method: 'POST', body: JSON.stringify(data) }),
    updateCourseDetails: (slug: string, data: any) =>
      fetchApi(`/admin/courses/${slug}/details`, { method: 'PATCH', body: JSON.stringify(data) }),

    // Certificates
    getCertificates: (params?: { page?: number; limit?: number; search?: string }) => {
      return fetchApi(`/admin/certificates${buildQuery(params)}`);
    },
    issueCertificate: (data: { userId: string; courseId: string; grade?: string }) =>
      fetchApi('/admin/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),
  },
};
