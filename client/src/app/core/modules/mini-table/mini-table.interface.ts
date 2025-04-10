export interface Item {
	title: string;
	value: string | number;
}

export interface Line {
	line: true
}

// export type MiniTableItem = Item | Line;

export interface MiniTableItem {
	title: string;
	value: string | number;
}