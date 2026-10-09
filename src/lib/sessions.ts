import type { Token } from 'simple-oauth2';

const sessions = new Map<string, Token>();

export const createSession = (token: Token) => {
	const session_id = crypto.randomUUID();
	sessions.set(session_id, token);
	return session_id;
};

export const getSession = (session_id: string | undefined) => {
	if (!session_id) return null;
	return sessions.get(session_id) ?? null;
};

export const updateSession = (session_id: string, token: Token) => {
	const current = sessions.get(session_id);
	if (current) sessions.set(session_id, token);
};

export const deleteSession = (session_id: string) => {
	sessions.delete(session_id);
};
