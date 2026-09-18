const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
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
      const errorMsg = data?.message || data?.error || 'An unexpected error occurred';
      const error: any = new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    throw err;
  }
}

export const api = {
  // Auth
  register: (userData: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  verifyOtp: (email: string, code: string) => fetchApi('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, code }) }),
  sendOtp: (email: string, name?: string) => fetchApi('/auth/send-otp', { method: 'POST', body: JSON.stringify({ email, name }) }),
  login: (credentials: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getProfile: () => fetchApi('/auth/profile'),

  // Courses & Internships
  getCourses: (params?: { domain?: string; type?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchApi(`/courses${query ? `?${query}` : ''}`);
  },
  getCourseBySlug: (slug: string) => fetchApi(`/courses/${slug}`),
  enrollFree: (slug: string) => fetchApi(`/courses/${slug}/enroll-free`, { method: 'POST' }),
  applyCohort: (slug: string, note?: string) => fetchApi(`/courses/${slug}/apply`, { method: 'POST', body: JSON.stringify({ note }) }),

  // Progress
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
  createOrder: (courseId: string, couponCode?: string) => fetchApi('/payments/create-order', { method: 'POST', body: JSON.stringify({ courseId, couponCode }) }),
  verifyPayment: (paymentData: any) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Certificates
  getMyCertificates: () => fetchApi('/certificates/my'),
  getCertificate: (courseId: string) => fetchApi(`/certificates/me/${courseId}`),
  verifyCertificatePublic: (certId: string) => fetchApi(`/verify/${certId}`),
  getDownloadUrl: (certId: string) => `${API_BASE_URL}/certificates/${certId}/download`,

  // Refunds
  requestRefund: (refundData: any) => fetchApi('/refunds/request', { method: 'POST', body: JSON.stringify(refundData) }),
  getRefundStatus: (paymentId: string) => fetchApi(`/refunds/${paymentId}`),
};
