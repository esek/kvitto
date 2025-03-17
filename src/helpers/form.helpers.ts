export const formDataToJson = <T>(formData: FormData) => {
	return Object.fromEntries(formData) as unknown as T;
};

export const stringToJson = <T>(string: string) => {
	return JSON.parse(string) as unknown as T;
};
