import { FeatureCollection, LineString } from "geojson";

export type Bounds = [number, number, number, number];

export type OriginalProperties = {
  NUM_LIGNE: string;
  CODE_TRONCON: string;
  LONGUEUR: number;
  NIVEAU_VALID_SUPPORT_VIAIRE: string;
  NIVEAU_VALID_AMENAG: string;
  APPORT_RERV: string;
  NOM_MOA: string;
  TYPE_MOA: string;
  PHASE: string;
  Bloqué: boolean | null;
  "Collectivité responsable du blocage": string | null;
  Commentaire: string | null;
  doublon: boolean | null;
  ITINERAIRE_PROV_DEF: string | null;
  "Niveau aménagement manuel": string | null;
};

export enum TronçonStatus {
  Planned = "Planned",
  PreExisting = "PreExisting",
  Building = "Building",
  Built = "Built",
  Blocked = "Blocked",
  Unknown = "Unknown",
}

export enum TronçonPhase {
  Une = "1",
  Deux = "2",
}

export type TronçonProperties = {
  id: string;
  length: number;
  status: TronçonStatus;
  phase: TronçonPhase;
  route: string[];
  variant: boolean;
  commune?: string;
  departement?: string;
  typeMOA: TypeMOA;
  moa: string;
  blockingCommune: string | null;
  comment: string | null;
};

export type AdminExpressProperties = {
  nom: string;
};

// It’s actually a geojson, with typed properties
export type Tronçon = {
  type: string;
  geometry: { type: string; coordinates: number[][][] };
  properties: TronçonProperties;
};

export type LengthStats = { [index: string]: number };

export type RouteStats = {
  code: string;
  stats: LengthStats;
  total: number;
  bounds: Bounds;
};
export type RoutesMap = { [index: string]: RouteStats };

export type PhaseStats = {
  phase: string;
  stats: LengthStats;
  total: number;
  bounds: Bounds;
};
export type PhasesMap = { [index: string]: PhaseStats };

export type DepartementMap = { [index: string]: GlobalStats };

export type GlobalStats = {
  stats: LengthStats;
  total: number;
};

export type Level =
  | { level: "region" }
  | { level: "phase"; props: PhaseStats }
  | { level: "route"; props: RouteStats }
  | { level: "segment"; props: TronçonProperties };

export type GlobalData = {
  tronçons: FeatureCollection<LineString, TronçonProperties>;
  globalBounds: [number, number, number, number];
  phases: PhasesMap;
  routes: RoutesMap;
  globalStats: GlobalStats;
  departementStats: DepartementMap;
};

export enum TypeMOA {
  Commune = 1,
  Departement,
  EPCI,
  Unknown,
}
