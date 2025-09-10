export interface AuthUser {
    id: string;
    username?: string;
    email?: string;
    [key: string]: any;
  }
  
  export interface UseAuthUserReturn {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
    logout: () => Promise<void>;
    isValid: boolean;
  }
  
  export type ValidRedirectPaths =
    | "/(dashboard)/home"
    | "/login"
    | "/(auth)/forgot-password";
  
  export interface UseRedirectIfAuthOptions {
    redirectPath?: ValidRedirectPaths;
    onRedirect?: () => void;
    onStay?: () => void;
  }
  