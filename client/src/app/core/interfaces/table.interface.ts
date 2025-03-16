export interface TableHeader {
	name: string;

	sort: string;
}

export type TableViewMode = 'list' | 'cards' | 'grid' | 'mosaic';