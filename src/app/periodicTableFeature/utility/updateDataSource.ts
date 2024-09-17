import { PeriodicTableItem } from '@periodicTableFeature/const/periodicTableExample';

export function updateDataSource(
  periodicTable: PeriodicTableItem[],
  rowData:PeriodicTableItem
): PeriodicTableItem[] {
  return periodicTable.map((item: PeriodicTableItem) => {
    if (isElementChanged(item, rowData)) {
      return rowData;
    }
    return item;
  });
}

function isElementChanged(element: PeriodicTableItem, newElement: PeriodicTableItem): boolean {
  return element.position === newElement.position
    || element.name === newElement.name
    || element.weight === newElement.weight
    || element.symbol === newElement.symbol;
}
