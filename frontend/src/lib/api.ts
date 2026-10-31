export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        return 'https://devascent-academy.onrender.com/api/v1';
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
  getCurriculum: (slug: string) => fetchApi(`/courses/${slug}/curriculum`),
  enrollFree: (slug: string) => fetchApi(`/courses/${slug}/enroll-free`, { method: 'POST' }),
  applyCohort: (slug: string, note?: string) => fetchApi(`/courses/${slug}/apply`, { method: 'POST', body: JSON.stringify({ note }) }),

  // Progress & Enrollments
  getMyEnrollments: () => fetchApi('/me/enrollments'),
  getMyStats: () => fetchApi('/me/stats'),
  getMyAnalytics: () => fetchApi('/me/analytics'),
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
  validateCoupon: (code: string, courseId: string, amountInPaise: number) =>
    fetchApi('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, courseId, amountInPaise }) }),

  // Certificates
  getMyCertificates: () => fetchApi('/certificates/my'),
  getCertificate: (courseId: string) => fetchApi(`/certificates/me/${courseId}`),
  verifyCertificatePublic: (certId: string) => fetchApi(`/verify/${certId}`),
  getDownloadUrl: (certId: string) => `${getApiBaseUrl()}/certificates/${certId}/download`,
  // Academic Documents (Offer Letters & LORs)
  getMyDocuments: () => fetchApi('/documents/my'),
  generateOfferLetter: (courseId: string) => fetchApi(`/documents/offer-letter/${courseId}`, { method: 'POST' }),
  getDocumentDownloadUrl: (docId: string) => `${getApiBaseUrl()}/documents/${docId}/download`,
  verifyDocumentPublic: (docId: string) => fetchApi(`/documents/verify/${docId}`),
  // Public Portfolio
  getPublicPortfolio: (username: string) => fetchApi(`/portfolio/public/${username}`),
  getMyPortfolioHandle: () => fetchApi('/portfolio/my-handle'),
  updatePortfolioProfile: (data: any) => fetchApi('/portfolio/update-settings', { method: 'PATCH', body: JSON.stringify(data) }),
  // Student Referrals & Campus Flywheel
  getMyReferralSummary: () => fetchApi('/referrals/my-summary'),
  validateReferralCode: (code: string) => fetchApi('/referrals/validate', { method: 'POST', body: JSON.stringify({ code }) }),
  requestReferralPayout: (upiId: string, amountPaise?: number) => fetchApi('/referrals/request-payout', { method: 'POST', body: JSON.stringify({ upiId, amountPaise }) }),

  // Doubts & Q/A Forum
  createDoubt: (data: { question: string; courseId?: string; lessonId?: string; isUrgent?: boolean }) =>
    fetchApi('/doubts', { method: 'POST', body: JSON.stringify(data) }),
  getMyDoubts: (params?: { courseId?: string; status?: string; page?: number; limit?: number }) =>
    fetchApi(`/doubts/my${buildQuery(params)}`),
  getLessonDoubts: (lessonId: string) => fetchApi(`/doubts/lesson/${lessonId}`),

  // In-App Notifications
  getNotifications: (params?: { page?: number; limit?: number }) =>
    fetchApi(`/notifications${buildQuery(params)}`),
  markNotificationRead: (id: string) =>
    fetchApi(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () =>
    fetchApi('/notifications/read-all', { method: 'POST' }),

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

    // Enrollments
    getEnrollments: (params?: { page?: number; limit?: number; search?: string; courseId?: string; status?: string }) => {
      return fetchApi(`/admin/enrollments${buildQuery(params)}`);
    },

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
    updateCourseProject: (slug: string, data: { projectPdfUrl?: string; projectPdfTitle?: string }) =>
      fetchApi(`/admin/courses/${slug}/project`, { method: 'PATCH', body: JSON.stringify(data) }),

    // AI Overview Videos (Studio A)
    getAiVideos: (slug: string) => fetchApi(`/admin/courses/${slug}/videos`),
    createAiVideo: (slug: string, data: any) =>
      fetchApi(`/admin/courses/${slug}/videos`, { method: 'POST', body: JSON.stringify(data) }),
    updateAiVideo: (id: string, data: any) =>
      fetchApi(`/admin/videos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteAiVideo: (id: string) =>
      fetchApi(`/admin/videos/${id}`, { method: 'DELETE' }),

    // Certificates
    getCertificates: (params?: { page?: number; limit?: number; search?: string }) => {
      return fetchApi(`/admin/certificates${buildQuery(params)}`);
    },
    issueCertificate: (data: { userId: string; courseId: string; grade?: string }) =>
      fetchApi('/admin/certificates/issue', { method: 'POST', body: JSON.stringify(data) }),
    issueLor: (data: { userId: string; courseId: string; grade?: string }) =>
      fetchApi('/admin/academic-documents/lor/issue', { method: 'POST', body: JSON.stringify(data) }),
    getAcademicDocuments: () => fetchApi('/admin/academic-documents'),
    getReferralPayouts: () => fetchApi('/referrals/admin/payouts'),
    processReferralPayout: (payoutId: string, data: { action: 'APPROVE' | 'REJECT'; txReference?: string; adminNote?: string }) =>
      fetchApi(`/referrals/admin/payouts/${payoutId}/process`, { method: 'POST', body: JSON.stringify(data) }),

    // Quiz Reset
    resetStudentQuiz: (quizId: string, userId: string) =>
      fetchApi(`/admin/quizzes/${quizId}/reset/${userId}`, { method: 'POST' }),

    // Coupons
    getCoupons: (params?: { page?: number; limit?: number; status?: string; search?: string; courseId?: string }) => {
      return fetchApi(`/admin/coupons${buildQuery(params)}`);
    },
    getCouponById: (id: string) => fetchApi(`/admin/coupons/${id}`),
    createCoupon: (data: any) =>
      fetchApi('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
    updateCoupon: (id: string, data: any) =>
      fetchApi(`/admin/coupons/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deactivateCoupon: (id: string) =>
      fetchApi(`/admin/coupons/${id}`, { method: 'DELETE' }),

    // Student Queries / Q&A Desk
    getQueries: (params?: { page?: number; limit?: number; status?: string; search?: string; courseId?: string; isUrgent?: boolean }) => {
      return fetchApi(`/admin/queries${buildQuery(params)}`);
    },
    answerQuery: (id: string, answer: string) =>
      fetchApi(`/admin/queries/${id}/answer`, { method: 'PATCH', body: JSON.stringify({ answer }) }),
    deleteQuery: (id: string) =>
      fetchApi(`/admin/queries/${id}`, { method: 'DELETE' }),

    // In-App Notifications Broadcast
    createNotification: (data: any) =>
      fetchApi('/admin/notifications', { method: 'POST', body: JSON.stringify(data) }),
    getBroadcasts: (params?: { page?: number; limit?: number; search?: string }) => {
      return fetchApi(`/admin/notifications${buildQuery(params)}`);
    },
    deleteBroadcast: (id: string) =>
      fetchApi(`/admin/notifications/${id}`, { method: 'DELETE' }),
  },

  // Student AI Video endpoints
  markAiVideoWatched: (id: string) =>
    fetchApi(`/ai-videos/${id}/mark-watched`, { method: 'POST' }),

  // Generic REST helpers for convenience
  get: (endpoint: string, options?: RequestInit) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: (endpoint: string, body?: any, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: (endpoint: string, options?: RequestInit) =>
    fetchApi(endpoint, { ...options, method: 'DELETE' }),
};
