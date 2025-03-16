import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'sort',
	standalone: true
})
export class SortPipe<T> implements PipeTransform {
	transform(data: T[], path: string, descending: boolean): T[] {
		const setValue = (item: T, path: string): number | string | undefined => {
			if (path === 'completion') {
				return this._getCompletionPercentage(item);
			}

			return this._getValue(item, path);
		};

		data.sort((a, b) => {
			const aValue = setValue(a, path);

			const bValue = setValue(b, path);

			if (aValue === undefined && bValue === undefined) {
				return 0;
			}

			if (aValue === undefined || isNaN(+aValue) || !isFinite(+aValue)) {
				return descending ? 1 : -1;
			}

			if (bValue === undefined || isNaN(+bValue) || !isFinite(+bValue)) {
				return descending ? -1 : 1;
			}

			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return descending ? bValue - aValue : aValue - bValue;
			} else {
				const result = (aValue as string).localeCompare(bValue as string);

				return descending ? -result : result;
			}
		});

		return data;
	}

	private  _getCompletionPercentage = (item: T): number => {
		if (item && typeof item === 'object' && 'achievementsUnlocked' in item && 'achievements' in item) {
			const percentage = (item.achievementsUnlocked as number / (item.achievements as unknown[]).length) * 100;

			return Number(percentage.toFixed(2));
		}

		return 0;
	};

	private _getValue(object: T, path: string): string | number | undefined {
		const keys = path.split('.');

		const value = keys.reduce((o: unknown, key) => {
			if (o && typeof o === 'object' && key in o) {
				return (o as Record<string, unknown>)[key];
			}

			return undefined;
		}, object);

		if (typeof value === 'string' || typeof value === 'number') {
			return value;
		}

		return undefined;
	}
}