export const getOAuth2Redirect = (currentUrl: URL, nextUrlBaseName: string) => {
	const redirect = currentUrl.searchParams.get('redirect_uri');
	if (!redirect) {
		return nextUrlBaseName;
	}
	return nextUrlBaseName + '?redirect_uri=' + redirect;
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
		return decodeURIComponent(message[1]);
	}
	const message = url.searchParams.get('message');
	if (message) {
		return decodeURIComponent(message);
	}
	return message;
};
