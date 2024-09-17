import { PeriodicTableItem } from '@periodicTableFeature/const/periodicTableExample';

export function getFilteredData(data: PeriodicTableItem[], searchWord: unknown): PeriodicTableItem[] {
  if (typeof searchWord !== 'string' || searchWord === '') {
    return data;
  }

  return data.filter((item: PeriodicTableItem) => {
    let result = false;
    const keysArray = Object.keys(item) as (keyof PeriodicTableItem)[];

    keysArray.forEach((key) => {
      const tableField = item[key];
      if (isIncludesWord(tableField, searchWord)) result = true;
    });

    return result;
  });
}

function isIncludesWord(field: string | number, word: string): boolean {
  const stringField = field.toString();
  return stringField.toLowerCase().includes(word);
}
