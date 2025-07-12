// user.model.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'editor' | 'viewer'; // example roles
  isActive?: boolean;
}
