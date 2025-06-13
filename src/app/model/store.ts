export interface Store {
    countries: any[] | null,
    selectedCountry: any | null
    coordinates: number[] | null,
    loadingLocationAssetsStatus: boolean
}