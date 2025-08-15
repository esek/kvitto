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
