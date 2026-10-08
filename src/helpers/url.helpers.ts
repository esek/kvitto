export const getOAuth2Redirect = (currentUrl: URL, nextUrlBaseName: string) => {
	const redirect = currentUrl.searchParams.get('redirect_uri');
	if (!redirect) {
		return nextUrlBaseName;
	}
	return nextUrlBaseName + '?redirect_uri=' + encodeURIComponent(redirect);
};

export const addRedirect = (url: URL, redirect: string) => {
	const newUrl = new URL(url);
	newUrl.searchParams.set('redirect_uri', redirect);
	return newUrl;
};

export const addMessage = (url: URL | string, message: string) => {
	if (typeof url === 'string') {
		return url + (url.includes('?') ? '&' : '?') + 'message=' + encodeURIComponent(message);
	}
	const newUrl = new URL(url);
	newUrl.searchParams.set('message', message);
	return newUrl;
};

export const readMessage = (url: URL | string) => {
	if (typeof url === 'string') {
		const message = url.split('message=');
		if (message.length < 2 || message[1] === undefined) {
			return null;
		}
		return message
			.slice(1)
			.map((m, i) => decodeURIComponent(m).slice(0, i + 2 != message.length ? -1 : undefined));
	}
	const message = url.searchParams.getAll('message');
	return message.map((m) => decodeURIComponent(m));
};
