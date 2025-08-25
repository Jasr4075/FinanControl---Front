import { useRouter } from "expo-router";
import { clearAuth, getUser, validateToken } from "@/src/utils/auth";
import { useCallback, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

interface UseAuthUserReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
  isValid: boolean;
}

export default function useAuthUser(): UseAuthUserReturn {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, tokenValid] = await Promise.all([
        getUser(),
        validateToken()
      ]);

      setIsValid(tokenValid);
      
      if (userData && tokenValid) {
        setUser(userData);
      } else {
        setUser(null);
        if (!tokenValid) {
          setError("Sessão expirada. Faça login novamente.");
          await clearAuth();
        }
      }
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar usuário");
      setUser(null);
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await clearAuth();
      setUser(null);
      setIsValid(false);
      setError(null);
      router.replace("/login");
    } catch (e: any) {
      setError(e?.message || "Erro ao fazer logout");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { user, loading, error, reload: load, logout, isValid };
}