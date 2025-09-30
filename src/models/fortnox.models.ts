export type FortnoxPagination = {
	MetaInformation: { '@TotalResources': number; '@TotalPages': number; '@CurrentPage': number };
};

export type FortnoxAccount = {
	'@url'?: string;
	Active?: boolean;
	BalanceBroughtForward?: number;
	CostCenter?: string;
	CostCenterSettings?: 'ALLOWED' | 'MANDATORY' | 'NOTALLOWED';
	Description: string;
	Number: number;
	Project?: string;
	ProjectSettings?: 'ALLOWED' | 'MANDATORY' | 'NOTALLOWED';
	SRU?: number;
	Year?: number;
	VATCode?: string;
};

export type FortnoxCostCenter = {
	'@url': string;
	Code: string;
	Description: string;
	Note?: string;
	Active: boolean;
};

export type FortnoxProject = {
	'@url'?: string;
	Description: string;
	EndDate?: string;
	ProjectLeader?: string;
	ProjectNumber?: string;
	Status?: 'NOTSTARTED' | 'ONGOING' | 'COMPLETED';
	StartDate?: string;
};

export type FortnoxSupplier = {
	'@url'?: string;
	Active?: boolean;
	Address1?: string;
	Address2?: string;
	BG?: string;
	BIC?: string;
	BankAccountNumber?: string;
	City?: string;
	CostCenter?: string;
	CountryCode?: string;
	Currency?: string;
	DisablePaymentFile?: boolean;
	Email?: string;
	IBAN?: string;
	Name: string;
	OrganisationNumber?: string;
	PG?: string;
	Phone?: string;
	PreDefinedAccount?: string;
	Project?: string;
	SupplierNumber?: string;
	TermsOfPayment?: string;
	ZipCode?: string;
};

export type FortnoxAccountsResponse = FortnoxPagination & { Accounts: FortnoxAccount[] };
export type FortnoxCostCentersResponse = FortnoxPagination & { CostCenters: FortnoxCostCenter[] };
export type FortnoxProjectsResponse = FortnoxPagination & { Projects: FortnoxProject[] };
export type FortnoxSuppliersResponse = FortnoxPagination & { Suppliers: FortnoxSupplier[] };
