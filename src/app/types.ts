import { LngLatBounds } from "maplibre-gl"

type Departement = {
  name: string,
  code: string,
  stats: {
    total: number,
    built: number,
  },
  bbox: LngLatBounds,
}

enum TronçonStatus {
  Planned = 1,
  Building,
  Built,
  Blocked,
  Unknown
}

type TronçonProperties = {
  length: number,
  departement: string|undefined,
  status: TronçonStatus,
  route: string,
  variant: boolean,
  commune: string|undefined,
  id: string,
}

// It’s actually a geojson, with typed properties
type Tronçon = {
  type: string,
  geometry: {type: string, coordinates: number[][][]},
  properties: TronçonProperties,
}

export type {Departement, TronçonProperties, Tronçon}
export {TronçonStatus}
