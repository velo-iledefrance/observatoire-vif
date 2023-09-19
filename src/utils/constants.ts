import { TronçonStatus, TypeMOA } from "@/app/types";

export const statusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant au 01/01/2022",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "En travaux",
  [TronçonStatus.Planned]: "En cours de discussion",
  [TronçonStatus.Blocked]: "Au point mort",
  [TronçonStatus.SecondPhase]: "Phase 2 (2030)",
  [TronçonStatus.Unknown]: "Inconnu",
};

export const shortStatusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "En travaux",
  [TronçonStatus.Planned]: "En discussion",
  [TronçonStatus.Blocked]: "Au point mort",
  [TronçonStatus.SecondPhase]: "Phase 2",
  [TronçonStatus.Unknown]: "Inconnu",
};

export const statusColor = {
  [TronçonStatus.PreExisting]: "#4f9c5f",
  [TronçonStatus.Built]: "#2ed546",
  [TronçonStatus.Building]: "#8cdc4f",
  [TronçonStatus.Planned]: "#ff8400",
  [TronçonStatus.Blocked]: "#DA2F4C",
  [TronçonStatus.SecondPhase]: "#FFF",
  [TronçonStatus.Unknown]: "#7E7E7E",
};

export const fadedStatusColor = {
  [TronçonStatus.PreExisting]: "#a3d1af",
  [TronçonStatus.Built]: "#8aefa4",
  [TronçonStatus.Building]: "#b7ec8a",
  [TronçonStatus.Planned]: "#f7b56e",
  [TronçonStatus.Blocked]: "#ea8696",
  [TronçonStatus.SecondPhase]: "#FFF",
  [TronçonStatus.Unknown]: "#b3b3b3",
};

export const moaLabel = {
  [TypeMOA.Commune]: "Commune",
  [TypeMOA.Departement]: "Département",
  [TypeMOA.EPCI]: "",
  [TypeMOA.Unknown]: "",
};

export const routeName: { [index: string]: string[] } = {
  V1: ["Le Mesnil-Aubry", "Arpajon"],
  V2: ["Aéroport Charles-de-Gaulle", "Vélizy-Villacoublay"],
  V3: [
    "Parc des Expositions Villepinte / Claye-Souilly",
    "Maurepas – La Verrière",
  ],
  V4: ["Val d’Europe", "Cergy-Pontoise"],
  V5: ["Pontault-Combault", "Poissy"],
  V6: ["Tournan-en-Brie / Verneuil-l’Etang", "Cergy-Pontoise"],
  V7: ["Saint-Fargeau-Ponthierry / Melun", "Mantes-la-Jolie"],
  V8: ["Plaisir", "Paris"],
  V9: ["Val d’Europe", "Saint-Nom-la-Bretèche"],
  V10: ["Petite ceinture"],
  V20: ["Grande ceinture"],
};
