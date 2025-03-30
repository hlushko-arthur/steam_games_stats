export interface TableHeader {
	title: string;
	sortKey: string;
	default?: boolean;
}

export type TableHeaders = TableHeader[];

export type TableViewMode = 'list' | 'cards' | 'grid' | 'mosaic';