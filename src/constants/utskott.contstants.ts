import { Utskott } from '@prisma/client';
import type { IOption } from '../models/form.models';

export const UTSKOTT_LABELS: Record<Utskott, string> = {
	STYRELSEN: 'Styrelsen',
	CM: 'CM',
	FVU: 'FvU',
	INFU: 'InfU',
	KM: 'KM',
	NOLLU: 'NollU',
	ENU: 'ENU',
	NOJU: 'NöjU',
	PENGU: 'PengU',
	E6: 'E6',
	SRE: 'SRE',
	OTHER: 'Övrigt'
};

export const UTSKOTT_OPTIONS: IOption[] = [
	{
		label: UTSKOTT_LABELS[Utskott.STYRELSEN],
		value: Utskott.STYRELSEN
	},
	{
		label: UTSKOTT_LABELS[Utskott.CM],
		value: Utskott.CM
	},
	{
		label: UTSKOTT_LABELS[Utskott.FVU],
		value: Utskott.FVU
	},
	{
		label: UTSKOTT_LABELS[Utskott.INFU],
		value: Utskott.INFU
	},
	{
		label: UTSKOTT_LABELS[Utskott.KM],
		value: Utskott.KM
	},
	{
		label: UTSKOTT_LABELS[Utskott.NOLLU],
		value: Utskott.NOLLU
	},
	{
		label: UTSKOTT_LABELS[Utskott.ENU],
		value: Utskott.ENU
	},
	{
		label: UTSKOTT_LABELS[Utskott.NOJU],
		value: Utskott.NOJU
	},
	{
		label: UTSKOTT_LABELS[Utskott.PENGU],
		value: Utskott.PENGU
	},
	{
		label: UTSKOTT_LABELS[Utskott.E6],
		value: Utskott.E6
	},
	{
		label: UTSKOTT_LABELS[Utskott.SRE],
		value: Utskott.SRE
	},
	{
		label: UTSKOTT_LABELS[Utskott.OTHER],
		value: Utskott.OTHER
	}
];
