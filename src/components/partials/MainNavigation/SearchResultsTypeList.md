```js
const searchString = 'kart';
const searchResults = {
    Facets: [],
    Limit: 5,
    NumFound: 3873,
    Offset: 1,
    Results: [
        {
            Title: 'Historiske kart',
            Type: 'dataset',
            TypeTranslated: 'Datasett',
            ShowDetailsUrl: 'https://kartkatalog.dev.geonorge.no/metadata/uuid/a8b1ad90-e0fc-4ea0-bab8-dd80a8494052'
        },
        {
            Title: 'Dekningsoversikter historiske kart',
            Type: 'dataset',
            TypeTranslated: 'Datasett',
            ShowDetailsUrl: 'https://kartkatalog.dev.geonorge.no/metadata/uuid/2241ef4d-d81f-405d-8007-bac040345e32'
        },
        {
            Title: 'Løsmasser forenklet kart (N1000)',
            Type: 'dataset',
            TypeTranslated: 'Datasett',
            ShowDetailsUrl: 'https://kartkatalog.dev.geonorge.no/metadata/uuid/fd37fe85-ab6d-4e9e-8ca8-f09fffdba86d'
        },
        {
            Title: 'N250 Kartdata',
            Type: 'dataset',
            TypeTranslated: 'Datasett',
            ShowDetailsUrl: 'https://kartkatalog.dev.geonorge.no/metadata/uuid/442cae64-b447-478d-b384-545bc1d9ab48'
        },
        {
            Title: 'N50 Kartdata',
            Type: 'dataset',
            TypeTranslated: 'Datasett',
            ShowDetailsUrl: 'https://kartkatalog.dev.geonorge.no/metadata/uuid/ea192681-d039-42ec-b1bc-f3ce04c189ac'
        }
    ],
    Type: 'search',
    TypeTranslated: 'Datasett'
};
const searchResultsType = 'dataset';
<SearchResultsTypeList searchString={searchString} searchResults={searchResults} searchResultsType={searchResultsType}/>
```
