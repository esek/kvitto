export interface INotification {
	type: 'success' | 'danger' | 'warning';
	message?: string;
	title?: string;
	timeout?: number;
	id?: string;
}
