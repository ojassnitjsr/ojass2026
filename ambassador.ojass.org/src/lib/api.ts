// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LoginResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    ojassId: string;
    referralCount?: number;
    [key: string]: unknown;
  };
  token: string;
}

interface ReferralStatsResponse {
  success: boolean;
  ojassId: string;
  referralCount: number;
  referredUsers: Array<{
    name: string;
    email: string;
    phone: string;
    ojassId: string;
    isPaid: boolean;
    registeredAt: string;
  }>;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (emailOrPhone: string, password: string): Promise<LoginResponse> => {
    // Determine if input is email or phone
    const isEmail = emailOrPhone.includes('@');
    const body = isEmail
      ? { email: emailOrPhone, password }
      : { phone: emailOrPhone, password };

    return apiRequest<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

// Referral API
export const referralAPI = {
  getStats: async (): Promise<ReferralStatsResponse> => {
    return apiRequest<ReferralStatsResponse>('/api/referral/stats');
  },
};

export type { LoginResponse, ReferralStatsResponse };

