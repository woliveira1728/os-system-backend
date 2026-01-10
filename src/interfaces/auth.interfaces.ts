export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatarUrl?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}