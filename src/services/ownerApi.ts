import { Platform } from 'react-native';

const HOSTED_OWNER_API_BASE_URL = 'https://mira-ai.marioxsoftware.net/scooty/v1/api';
const LOCAL_OWNER_API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000/v1/api',
  ios: 'http://localhost:3000/v1/api',
  default: 'http://localhost:3000/v1/api',
});

const globalOwnerApiBaseUrl = (globalThis as { __OWNER_API_BASE_URL__?: string }).__OWNER_API_BASE_URL__;

export const OWNER_API_BASE_URL: string =
  globalOwnerApiBaseUrl?.trim() || HOSTED_OWNER_API_BASE_URL;

type JsonObject = Record<string, unknown>;

export type KycUploadFile = {
  uri: string;
  name: string;
  type: string;
  size?: number | null;
};

export type KycUploadFiles = {
  profilePhoto?: KycUploadFile | null;
  adharFile?: KycUploadFile | null;
  panFile?: KycUploadFile | null;
};

export type VehicleUploadFiles = {
  frontPhoto?: KycUploadFile | null;
  sidePhoto?: KycUploadFile | null;
  rcDocument?: KycUploadFile | null;
  insuranceDocument?: KycUploadFile | null;
};

export type Owner = {
  _id: string;
  name?: string;
  email?: string;
  mobile?: string;
  companyName?: string;
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  adress?: string;
  role?: string;
  profilePhotoUrl?: string;
  adharFile?: string;
  panFile?: string;
  kycSubmittedAt?: string | null;
  kycVerifiedAt?: string | null;
  walletBalance?: number;
  kycStatus?: string;
  kycRejectionReason?: string;
  settings?: OwnerSettings;
};

export type Bank = {
  _id?: string;
  ownerId?: string;
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  upiId?: string;
  fileUrl?: string;
  isVerified?: boolean;
  verificationNote?: string;
};

export type Dashboard = {
  walletBalance: number;
  earnings: {
    today: number;
    month: number;
    asOf?: string;
  };
  averageRating?: number | null;
  vehicles: {
    total: number;
    byStatus: Record<string, number>;
  };
  maintenanceOpenCount: number;
  unreadNotifications: number;
  liveActivity: DashboardActivityItem[];
};

export type DashboardActivityItem = {
  title: string;
  detail: string;
  time?: string;
  type?: string;
  createdAt?: string | null;
};

export type NotificationItem = {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
};

export type EarningsResponse = {
  summary: {
    today: number;
    week: number;
    month: number;
    totalCredit: number;
    totalDebit: number;
    gstCollected: number;
    platformCommission: number;
  };
  trend: Array<{
    label: string;
    value: number;
    date?: string;
  }>;
  vehicleWise: Array<{
    label: string;
    value: number;
    count?: number;
  }>;
  payouts: PayoutItem[];
  recentTransactions: TransactionItem[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
};

export type TransactionItem = {
  _id?: string;
  type?: string;
  direction?: string;
  amount?: number;
  description?: string;
  createdAt?: string;
  referenceId?: string;
  status?: string;
};

export type PayoutItem = {
  _id: string;
  amount: number;
  status: string;
  createdAt?: string;
  bankSnapshot?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumberLast4?: string;
    ifsc?: string;
    upiId?: string;
  };
};

export type PointLocation = {
  type: 'Point';
  coordinates: [number | string, number | string];
};

export type VehicleItem = {
  _id: string;
  modelName?: string;
  registrationNumber?: string;
  chassisNumber?: string;
  status?: string;
  batteryPercent?: number | null;
  locationLabel?: string;
  location?: PointLocation;
  stationId?: string;
  station?: {
    id?: string;
    name?: string;
    address?: string;
  } | null;
  photos?: {
    frontUrl?: string;
    sideUrl?: string;
  };
  documents?: {
    rcUrl?: string;
    insuranceUrl?: string;
  };
  openMaintenanceCount?: number;
  earnings?: number;
  rating?: number | null;
  totalRides?: number;
  lastRide?: {
    rideId?: string;
    status?: string;
    label?: string;
    at?: string;
    atLabel?: string;
    riderName?: string;
  } | null;
  createdAt?: string;
  performance?: VehiclePerformance;
  recentRideHistory?: VehicleRideHistoryItem[];
  maintenanceHistory?: VehicleMaintenanceHistoryItem[];
};

export type VehiclePerformance = {
  totalRides?: number;
  activeRides?: number;
  revenue?: number;
  averageRating?: number;
};

export type VehicleRideHistoryItem = {
  rideId: string;
  riderName?: string;
  riderId?: string | null;
  date?: string;
  dateLabel?: string;
  durationMinutes?: number;
  distanceKm?: number | null;
  fare?: number;
  status?: string;
};

export type VehicleMaintenanceHistoryItem = {
  requestId: string;
  issueType?: string;
  status?: string;
  description?: string;
  resolutionNote?: string;
  photoUrl?: string;
  createdAt?: string;
  createdAtLabel?: string;
  updatedAt?: string;
  updatedAtLabel?: string;
};

export type SupportFaq = {
  id: string;
  question: string;
  answer?: string;
};

export type SupportTicket = {
  _id: string;
  subject?: string;
  message?: string;
  status?: string;
  createdAt?: string;
  escalatedAt?: string;
  escalationNote?: string;
};

export type OwnerSettings = {
  notifications?: {
    rideUpdates?: boolean;
    earnings?: boolean;
    payout?: boolean;
    promotions?: boolean;
    maintenance?: boolean;
  };
  language?: string;
};

export type StationItem = {
  _id: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  location?: PointLocation;
};

export type OwnerKyc = {
  status?: string;
  rejectionReason?: string;
  submittedAt?: string | null;
  verifiedAt?: string | null;
  documents?: {
    profilePhotoUrl?: string;
    adharFile?: string;
    panFile?: string;
  };
};

type RequestOptions = {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  isFormData?: boolean;
  query?: Record<string, string | number | undefined | null>;
};

class ApiError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

const toQuery = (query?: RequestOptions['query']) => {
  if (!query) return '';
  const rendered = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  return rendered ? `?${rendered}` : '';
};

const appendFile = (formData: FormData, key: string, file?: KycUploadFile | null) => {
  if (!file) return;
  formData.append(key, {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as never);
};

const buildUrl = (baseUrl: string, path: string, query?: RequestOptions['query']) =>
  `${baseUrl}${path}${toQuery(query)}`;

const requestWithBase = async <T>(baseUrl: string, path: string, options: RequestOptions = {}): Promise<T> => {
  const url = buildUrl(baseUrl, path, options.query);
  const headers: Record<string, string> = {};

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  console.log(`[API] ${options.method ?? 'GET'} ${url}`, {
    hasToken: !!options.token,
    isFormData: options.isFormData,
    body: options.isFormData ? 'FormData' : options.body,
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body === undefined
          ? undefined
          : options.isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body),
    });
  } catch (error) {
    throw new ApiError(
      `Cannot reach API at ${baseUrl}. Make sure the backend is running and the device can access it.`,
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { code?: number; message?: string; data?: T }
    | null;

  console.log(`[API Response] ${response.status}`, { message: payload?.message, code: payload?.code });

  if (!response.ok || payload?.code === 0 || payload?.code === 3 || payload?.code === 5) {
    throw new ApiError(payload?.message || 'Request failed', payload?.code);
  }

  return (payload?.data ?? (payload as unknown as T)) as T;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  try {
    return await requestWithBase<T>(OWNER_API_BASE_URL, path, options);
  } catch (error) {
    const isRouteNotFound =
      error instanceof ApiError &&
      /route not found/i.test(error.message);
    const isLocalConnectionIssue =
      error instanceof ApiError &&
      /cannot reach api/i.test(error.message);

    if ((!isRouteNotFound && !isLocalConnectionIssue) || LOCAL_OWNER_API_BASE_URL === OWNER_API_BASE_URL) {
      throw error;
    }

    return await requestWithBase<T>(LOCAL_OWNER_API_BASE_URL as string, path, options);
  }
};

export const ownerApi = {
  signup: (payload: { fullName: string; address: string; mobile: string; city: string; companyName?: string }) =>
    request<{ token: string; owner: Owner }>('/owner/auth/signup', {
      method: 'POST',
      body: payload,
    }),
  sendOtp: (mobile: string) =>
    request<{ mobile: string; otp: string }>('/owner/auth/send-otp', {
      method: 'POST',
      body: { mobile },
    }),
  verifyOtp: (payload: {
    mobile: string;
    otp: string;
    fullName?: string;
    name?: string;
    address?: string;
    city?: string;
    companyName?: string;
  }) =>
    request<{ token: string; owner: Owner }>('/owner/auth/verify-otp', {
      method: 'POST',
      body: payload,
    }),
  dashboard: (token: string) =>
    request<{ dashboard: Dashboard }>('/owner/dashboard', { token }),
  profile: (token: string) =>
    request<{ owner: Owner; bank: Bank; dashboard: Dashboard; kyc: OwnerKyc }>('/owner/me', { token }),
  me: (token: string) => request<{ owner: Owner; bank: Bank; dashboard: Dashboard; kyc: OwnerKyc }>('/owner/me', { token }),
  updateProfile: (
    token: string,
    payload: Partial<Owner> & {
      name?: string;
      email?: string;
      city?: string;
      companyName?: string;
      address?: string;
      adress?: string;
      state?: string;
      pincode?: string;
      profilePhoto?: KycUploadFile | null;
    },
  ) =>
    payload.profilePhoto
      ? (() => {
          const formData = new FormData();
          if (payload.name !== undefined) formData.append('name', payload.name);
          if (payload.email !== undefined) formData.append('email', payload.email);
          if (payload.city !== undefined) formData.append('city', payload.city);
          if (payload.companyName !== undefined) formData.append('companyName', payload.companyName);
          if (payload.address !== undefined) formData.append('address', payload.address);
          if (payload.adress !== undefined) formData.append('adress', payload.adress);
          if (payload.state !== undefined) formData.append('state', payload.state);
          if (payload.pincode !== undefined) formData.append('pincode', payload.pincode);
          appendFile(formData, 'profilePhoto', payload.profilePhoto);

          return request<{ owner: Owner; bank: Bank }>('/owner/me', {
            method: 'PATCH',
            token,
            body: formData,
            isFormData: true,
          });
        })()
      : request<{ owner: Owner; bank: Bank }>('/owner/me', {
          method: 'PATCH',
          token,
          body: payload,
        }),
  bank: (token: string) => request<{ bank: Bank }>('/owner/bank', { token }),
  updateBank: (
    token: string,
    payload: {
      accountHolderName?: string;
      accountNumber?: string;
      bankName?: string;
      ifsc?: string;
      upiId?: string;
      bankFile?: KycUploadFile | null;
    },
  ) => {
    if (payload.bankFile) {
      const formData = new FormData();
      if (payload.accountHolderName !== undefined) formData.append('accountHolderName', payload.accountHolderName);
      if (payload.accountNumber !== undefined) formData.append('accountNumber', payload.accountNumber);
      if (payload.bankName !== undefined) formData.append('bankName', payload.bankName);
      if (payload.ifsc !== undefined) formData.append('ifsc', payload.ifsc);
      if (payload.upiId !== undefined) formData.append('upiId', payload.upiId);
      appendFile(formData, 'bankFile', payload.bankFile);

      return request<{ bank: Bank }>('/owner/bank', {
        method: 'PATCH',
        token,
        body: formData,
        isFormData: true,
      });
    }

    return request<{ bank: Bank }>('/owner/bank', {
      method: 'PATCH',
      token,
      body: payload,
    });
  },
  kyc: (token: string) => request<{ kyc: JsonObject }>('/owner/kyc', { token }),
  submitKyc: (token: string, files: KycUploadFiles = {}) => {
    const formData = new FormData();
    appendFile(formData, 'profilePhoto', files.profilePhoto);
    appendFile(formData, 'adharFile', files.adharFile);
    appendFile(formData, 'panFile', files.panFile);

    return request<{ kyc: JsonObject }>('/owner/kyc', {
      method: 'PATCH',
      token,
      body: formData,
      isFormData: true,
    });
  },
  notifications: (token: string, type?: string) =>
    request<{ notifications: NotificationItem[] }>('/owner/notifications', {
      token,
      query: { type },
    }),
  markNotificationRead: (token: string, notificationId: string) =>
    request<{ notification: NotificationItem }>(`/owner/notifications/${notificationId}/read`, {
      method: 'PATCH',
      token,
    }),
  earnings: (token: string, query: { from?: string; to?: string; type?: string } = {}) =>
    request<EarningsResponse>('/owner/earnings', { token, query }),
  transactions: (
    token: string,
    query: { type?: string; from?: string; to?: string; page?: number; limit?: number } = {},
  ) =>
    request<{ transactions: TransactionItem[]; pagination?: EarningsResponse['pagination'] }>(
      '/owner/transactions',
      {
        token,
        query,
      },
    ),
  payouts: (token: string) => request<{ payouts: PayoutItem[] }>('/owner/payouts', { token }),
  requestPayout: (token: string, amount: number) =>
    request<{ payout: PayoutItem }>('/owner/payouts/request', {
      method: 'POST',
      token,
      body: { amount },
    }),
  vehicles: (token: string, status?: string) =>
    request<{ vehicles: VehicleItem[] }>('/owner/vehicles', {
      token,
      query: { status },
    }),
  vehicleDetail: (token: string, vehicleId: string) =>
    request<{ vehicle: VehicleItem }>(`/owner/vehicles/${vehicleId}`, { token }),
  createVehicle: (
    token: string,
    payload: {
      modelName?: string;
      registrationNumber?: string;
      chassisNumber?: string;
      stationId?: string;
    },
    files: VehicleUploadFiles = {},
  ) =>
    {
      const hasUploads = Object.values(files).some(Boolean);
      console.log('[createVehicle] Called with:', { payload, hasUploads });
      
      if (!hasUploads) {
        return request<{ vehicle: VehicleItem }>('/owner/vehicles', {
          method: 'POST',
          token,
          body: payload,
        });
      }

      const formData = new FormData();
      if (payload.modelName !== undefined) formData.append('modelName', payload.modelName);
      if (payload.registrationNumber !== undefined) formData.append('registrationNumber', payload.registrationNumber);
      if (payload.chassisNumber !== undefined) formData.append('chassisNumber', payload.chassisNumber);
      if (payload.stationId !== undefined) formData.append('stationId', payload.stationId);

      appendFile(formData, 'frontUrl', files.frontPhoto);
      appendFile(formData, 'sideUrl', files.sidePhoto);
      appendFile(formData, 'rcDocument', files.rcDocument);
      appendFile(formData, 'insuranceDocument', files.insuranceDocument);

      console.log('[createVehicle] FormData prepared with files');
      
      return request<{ vehicle: VehicleItem }>('/owner/vehicles', {
        method: 'POST',
        token,
        body: formData,
        isFormData: true,
      });
    },
  updateVehicle: (
    token: string,
    vehicleId: string,
    payload: {
      modelName?: string;
      registrationNumber?: string;
      chassisNumber?: string;
      stationId?: string;
      submit?: boolean;
    },
  ) =>
    request<{ vehicle: VehicleItem }>(`/owner/vehicles/${vehicleId}`, {
      method: 'PATCH',
      token,
      body: payload,
    }),
  removeVehicle: (token: string, vehicleId: string) =>
    request<{ vehicle: VehicleItem }>(`/owner/vehicles/${vehicleId}`, {
      method: 'DELETE',
      token,
    }),
  faqs: (token: string) => request<{ faqs: SupportFaq[] }>('/owner/support/faqs', { token }),
  tickets: (token: string) => request<{ tickets: SupportTicket[] }>('/owner/support/tickets', { token }),
  createTicket: (token: string, payload: { subject: string; message: string }) =>
    request<{ ticket: SupportTicket }>('/owner/support/tickets', {
      method: 'POST',
      token,
      body: payload,
    }),
  ticketDetail: (token: string, ticketId: string) =>
    request<{ ticket: SupportTicket }>(`/owner/support/tickets/${ticketId}`, { token }),
  settings: (token: string) => request<{ settings: OwnerSettings }>('/owner/settings', { token }),
  updateSettings: (token: string, payload: { settings?: OwnerSettings; language?: string }) =>
    request<{ settings: OwnerSettings }>('/owner/settings', {
      method: 'PATCH',
      token,
      body: payload,
    }),
  stations: (
    token: string,
    query: { search?: string; city?: string; state?: string; lat?: number | string; lng?: number | string } = {},
  ) => request<{ stations: StationItem[] }>('/owner/stations', { token, query }),
};

export const ownerApiErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';
