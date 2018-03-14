import FilterCollection from "./FilterCollection";

export default class FilterCollectionFactory {
    public importJson(jsonString: string): FilterCollection {
        const json = JSON.parse(jsonString);
        return new FilterCollection(json.filters, json.categories);
    }

    public exportFilterCollection(filterCollection: FilterCollection): string {
        return JSON.stringify({
            title: filterCollection.getTitle(),
            categories: filterCollection.getCategories(),
            filters: filterCollection.getFilters()
        });
    }
}
