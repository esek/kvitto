import type { Utskott } from '@prisma/client';

export const UTSKOTT_TO_EMAIL_ADDRESS: Record<Utskott, string> = {
	STYRELSEN: 'pengamastare@esek.se',
	CM: 'cafemastare@esek.se',
	FVU: 'forvaltningschef@esek.se',
	INFU: 'informationschef@esek.se',
	KM: 'krogare@esek.se',
	NOLLU: 'nollu_ekonomi@esek.se',
	NOJU: 'entertainer@esek.se',
	ENU: 'enuordforande@esek.se',
	PENGU: 'pengamastare@esek.se',
	E6: 'sexmastare@esek.se',
	SRE: 'sreordforande@esek.se',
	OTHER: 'pengamastare@esek.se'
};
