export interface Credential {
  id: number;
}

export interface JwtPayload {
  id: number;
  type: 'admin' | 'staff';
}
