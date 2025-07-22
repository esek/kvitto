import colors from 'tailwindcss/colors';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'class', // Move this out of theme as it's a global config
	theme: {
		fontFamily: {
			sans: ['"Esek Font"', 'sans-serif']
		},
		extend: {
			colors: {
				voucher: {
					expenseClaim: '#228CB5',
					expenseReport: '#228C22',
					internalInvoice: '#D16806',
					salesReport: '#B58922',
					supplierInvoice: '#8422B5',
					driversExpense: '#B52222',
					accountingOrder: '#C2B616'
				},
				brand: {
					primary: '#269DD6',
					black: '#181818',
					gray: '#FAFAF9',
					success: '#10B981',
					danger: '#EF4444',
					warning: '#FBBF24',
					info: '#94A3B8'
				},
				e: {
					200: colors.sky['200'],
					400: colors.sky['400']
				},
				bme: {
					200: colors.rose['200'],
					400: colors.rose['400']
				},
				success: {
					dark: colors.green['500'],
					light: colors.green['200']
				},
				danger: {
					dark: colors.red['500'],
					light: colors.red['200']
				},
				warning: {
					dark: colors.yellow['500'],
					light: colors.yellow['200']
				},
				utskott: {
					cm: '#684539',
					e6: '#6AA84F',
					enu: '#296D41',
					fvu: '#C51E3A',
					infu: '#863AAA',
					km: '#434343',
					noju: '#C52068',
					nollu: '#3D85C6',
					sre: '#8E7CC3',
					styrelsen: '#151515',
					pengu: '#FFAA00',
					other: '#FAFAF9'
				},
				teknikfokus: '#13293e'
			},
			backgroundColor: {
				body: {
					light: colors.gray['50'],
					dark: colors.gray['900']
				}
			},
			textColor: {
				secondary: {
					light: colors.gray['600'],
					dark: colors.gray['300']
				}
			}
		}
	},

	plugins: []
} satisfies Config;
