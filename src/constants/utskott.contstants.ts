import { Utskott } from '@prisma/client';
import type { IOption } from '../models/form.models';

export const UTSKOTT_OPTIONS: IOption[] = [
	{
		label: 'Styrelsen',
		value: Utskott.STYRELSEN
	},
	{
		label: 'CM',
		value: Utskott.CM
	},
	{
		label: 'FvU',
		value: Utskott.FVU
	},
	{
		label: 'InfU',
		value: Utskott.INFU
	},
	{
		label: 'KM',
		value: Utskott.KM
	},
	{
		label: 'NollU',
		value: Utskott.NOLLU
	},
	{
		label: 'ENU',
		value: Utskott.ENU
	},
	{
		label: 'NöjU',
		value: Utskott.NOJU
	},
	{
		label: 'PengU',
		value: Utskott.PENGU
	},
	{
		label: 'E6',
		value: Utskott.E6
	},
	{
		label: 'SRE',
		value: Utskott.SRE
	},
	{
		label: 'Övrigt',
		value: Utskott.OTHER
	}
];
