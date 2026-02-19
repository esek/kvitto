import { config } from '@/config.private';

interface SearchUserResult {
	username: string;
	fullName: string;
	class: string;
}

const ekorreFetch = async (query: string, method: 'POST' | 'GET') => {
	try {
		const response = await fetch(`${config.EKORRE_URL}/api/ekorre`, {
			method,
			headers: {
				'Content-Type': 'application/json',
				'X-E-API-KEY': config.EKORRE_API_KEY
			},
			body: JSON.stringify({ query })
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error searching users:', error);
	}
	return null;
};

const filterHistoryInRange = (
	history: Array<{ start: string; end: string }>,
	start: Date,
	end: Date
): Array<{ start: string; end: string }> => {
	return history.filter((h) => {
		const historyStart = new Date(h.start);
		const historyEnd = new Date(h.end);
		return historyStart < end && historyEnd > start;
	});
};

export const postHistoryInRange = async (
	id: number,
	start: Date,
	end: Date
): Promise<{
	history: Array<{ holder: { username: string }; start: string; end: string }>;
}> => {
	const HISTORY = `
	history(current: false) {
		holder {
			username
		}
		start
		end
	}
	`;
	const query = `
	{
		post(id: ${id}) {
			${HISTORY}
		}
	}
	`;

	const data = await ekorreFetch(query, 'POST');
	if (data?.post) {
		data.post.history = filterHistoryInRange(data.post.history, start, end);
	}
	return data?.post;
};
