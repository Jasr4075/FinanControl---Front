import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { isAuthenticated, validateToken, getUser } from "@/src/utils/auth";
import { ValidRedirectPaths, UseRedirectIfAuthOptions } from "../types/types";

export default function useRedirectIfAuth(options: UseRedirectIfAuthOptions = {}) {
  const {
    redirectPath = "/(dashboard)/home",
    onRedirect,
    onStay,
  } = options;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        if (!isMounted) return;

        const [authenticated, tokenValid, userData] = await Promise.all([
          isAuthenticated(),
          validateToken(),
          getUser(),
        ]);

        if (!isMounted) return;

        if (authenticated && tokenValid && userData) {
          if (onRedirect) onRedirect();

          setTimeout(() => {
            if (isMounted) {
              // Agora o TS aceita porque redirectPath é do tipo ValidRedirectPaths
              router.replace(redirectPath);
            }
          }, 100);
        } else {
          if (onStay) onStay();

          if (authenticated && !tokenValid) {
            console.warn("Token inválido ou expirado");
            setError("Sessão expirada");
          }

          if (isMounted) setLoading(false);
        }
      } catch (err) {
        if (!isMounted) return;

        console.error("Erro ao verificar autenticação:", err);
        setError("Erro ao verificar autenticação");
        setLoading(false);

        if (onStay) onStay();
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, redirectPath, onRedirect, onStay]);

  return { loading, error };
}

// Versão simplificada
export function useRedirectIfAuthSimple(redirectPath: ValidRedirectPaths = "/(dashboard)/home") {
  return useRedirectIfAuth({ redirectPath });
}
