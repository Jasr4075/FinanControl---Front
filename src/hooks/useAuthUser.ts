import { clearAuth, getUser } from '@/src/utils/auth';
import { useCallback, useEffect, useState } from 'react';

export interface AuthUser {
	id: string;
	username?: string;
	email?: string;
	[name: string]: any;
}

export default function useAuthUser() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const u = await getUser();
			setUser(u);
		} catch (e: any) {
			setError(e?.message || 'Falha ao carregar usuário');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const logout = useCallback(async () => {
		await clearAuth();
		setUser(null);
	}, []);

	return { user, loading, error, reload: load, logout };
} 