export interface Point {
  pos: string
}

export interface GeocoderResponseMetaData {
  Point: Point
  found: string
  request: string
  results: string
}

export interface MetaDataProperty {
  GeocoderResponseMetaData: GeocoderResponseMetaData
}

export interface Component {
  kind: string
  name: string
}

export interface Address {
  Components: Component[]
  country_code: string
  formatted: string
}

export interface Thoroughfare {
  ThoroughfareName: string
}

export interface Locality {
  LocalityName: string
  Thoroughfare?: Thoroughfare
}

export interface SubAdministrativeArea {
  Locality: Locality
  SubAdministrativeAreaName: string
}

export interface AdministrativeArea {
  AdministrativeAreaName: string
  SubAdministrativeArea: SubAdministrativeArea
}

export interface Country {
  AddressLine: string
  AdministrativeArea: AdministrativeArea
  CountryName: string
  CountryNameCode: string
}

export interface AddressDetails {
  Country: Country
}

export interface GeocoderMetaData {
  Address: Address
  AddressDetails: AddressDetails
  kind: string
  precision: string
  text: string
}

export interface GeoObjectMetaDataProperty {
  GeocoderMetaData: GeocoderMetaData
}

export interface GeoObject {
  Point: Point
  boundedBy: {
    Envelope: {
      lowerCorner: string
      upperCorner: string
    }
  }
  description: string
  metaDataProperty: GeoObjectMetaDataProperty
  name: string
  uri: string
}

export interface FeatureMember {
  GeoObject: GeoObject
}

export interface GeoObjectCollection {
  featureMember: FeatureMember[]
  metaDataProperty: MetaDataProperty
}

export interface Response {
  GeoObjectCollection: GeoObjectCollection
}

export interface ApiResponse {
  response: Response
}
