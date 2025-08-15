// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AccessToken } from 'simple-oauth2';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			fortnox: AccessToken | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
