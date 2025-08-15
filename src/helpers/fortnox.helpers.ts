import type { components } from '@/models/openapi/fortnox/schema';
import { Utskott } from '@prisma/client';

export const utskottFromCostCenterCode = (code: string) => {
	const codeBase = code.replace(/\d+$/, '');
	switch (codeBase) {
		case 'SEK': {
			return Utskott.OTHER;
		}
		case 'STY': {
			return Utskott.STYRELSEN;
		}
		case 'CM': {
			return Utskott.CM;
		}
		case 'FVU': {
			return Utskott.FVU;
		}
		case 'INFU': {
			return Utskott.INFU;
		}
		case 'KM': {
			return Utskott.KM;
		}
		case 'PHOS': {
			return Utskott.NOLLU;
		}
		case 'ENU': {
			return Utskott.ENU;
		}
		case 'NOJU': {
			return Utskott.NOJU;
		}
		case 'PENG': {
			return Utskott.PENGU;
		}
		case 'SEX': {
			return Utskott.E6;
		}
		case 'SRE': {
			return Utskott.SRE;
		}
		default: {
			return Utskott.OTHER;
		}
	}
};

export const manageError = (error: {
	ErrorInformation?: components['schemas']['fortnox_ErrorInformationWrap_ErrorInformation'];
}) => {
	const info = error.ErrorInformation;
	const message = info?.Message ?? (info as unknown as { message?: string })?.message;
	if (!message) {
		return new Response('Unknown error from Fortnox.', { status: 500 });
	}
	return new Response(message, { status: 500 });
};
