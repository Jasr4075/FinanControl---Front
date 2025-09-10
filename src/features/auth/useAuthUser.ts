import { useRouter } from "expo-router";
import { clearAuth, getUser, validateToken } from "@/src/features/auth/auth";
import { useCallback, useEffect, useState } from "react";
import { UseAuthUserReturn, AuthUser } from "../auth/types";

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
    } catch (e) {
      let message = "Falha ao carregar usuário";
      if (e instanceof Error) message = e.message;
      setError(message);
      setUser(null);
      setIsValid(false);
      await clearAuth();
      router.replace("/login");
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
    } catch (e) {
      let message = "Erro ao fazer logout";
      if (e instanceof Error) message = e.message;
      setError(message);
      await clearAuth();
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { user, loading, error, reload: load, logout, isValid };
}