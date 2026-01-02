import { TronçonPhase, TronçonStatus, TypeMOA } from "@/app/types";
import Color from "color";
import _ from "lodash";

export const statusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant au 01/01/2022",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "Travaux",
  [TronçonStatus.Planned]: "À l’étude",
  [TronçonStatus.Blocked]: "Bloqué",
  [TronçonStatus.Unknown]: "Inconnu",
  ["variant"]: "Variante",
};

export const statusTooltip = {
  [TronçonStatus.PreExisting]: "",
  [TronçonStatus.Built]: "",
  [TronçonStatus.Building]: "Travaux en cours ou à venir",
  [TronçonStatus.Planned]: "",
  [TronçonStatus.Blocked]: "",
  [TronçonStatus.Unknown]: "",
  ["variant"]: "Hypothèse de tracé pour le réseau VIF",
};

export const phaseName: { [index: string]: string }  = {
  [TronçonPhase.Une]: "Phase 1 (2025)",
  [TronçonPhase.Deux]: "Phase 2 (2030)",  
}

export const shortStatusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "Travaux en cours ou à venir",
  [TronçonStatus.Planned]: "À l’étude",
  [TronçonStatus.Blocked]: "Bloqué",
  [TronçonStatus.Unknown]: "Inconnu",
};

export const statusColor = {
  [TronçonStatus.PreExisting]: "#B0C7B6",
  [TronçonStatus.Built]: "#0AB532",
  [TronçonStatus.Building]: "#79E70F",
  [TronçonStatus.Planned]: "#84D2FF",
  [TronçonStatus.Blocked]: "#DA2F4C",
  [TronçonStatus.Unknown]: "#BAB7B3",
  ["Background"]: "#ddddd5",
};

export const fadedStatusColor = {
  [TronçonStatus.PreExisting]: "#bed3c4",
  [TronçonStatus.Built]: "#9ad2a7",
  [TronçonStatus.Building]: "#c3e1a6",
  [TronçonStatus.Planned]: "#b4d0e0",
  [TronçonStatus.Blocked]: "#d17484",
  [TronçonStatus.Unknown]: "#dad7d4",
  ["Background"]: "#ddddd5",
};

//export const fadedStatusColor = _.mapValues(statusColor, c => Color(c).lighten(0.3).hex());

export const borderStatusColor = {
  [TronçonStatus.PreExisting]: "#195E2A",
  [TronçonStatus.Built]: "#666666",
  [TronçonStatus.Building]: "#666666",
  [TronçonStatus.Planned]: "#666666",
  [TronçonStatus.Blocked]: "#666666",
  [TronçonStatus.Unknown]: "#666666",
};

export const fadedBorderStatusColor = _.mapValues(
  borderStatusColor,
  (c) => "#d9d9d9",
);

export const statusIndex = {
  [TronçonStatus.PreExisting]: 2,
  [TronçonStatus.Built]: 5,
  [TronçonStatus.Building]: 4,
  [TronçonStatus.Planned]: 3,
  [TronçonStatus.Blocked]: 6,
  [TronçonStatus.Unknown]: 1,
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
  V6: ["Tournan-en-Brie / Verneuil-l’Étang", "Cergy-Pontoise"],
  V7: ["Saint-Fargeau-Ponthierry / Melun", "Mantes-la-Jolie"],
  V8: ["Plaisir", "Paris"],
  V9: ["Val d’Europe", "Saint-Nom-la-Bretèche"],
  V10: ["Petite ceinture"],
  V20: ["Grande ceinture"],
};

export const moaName: { [index: string]: string } = {
  ADP: "Aéroports de Paris",
  AEV: "Île-de-France Nature (ex Agence des espaces verts de la Région (AEV))",
  "BUSSY-SAINT-GEORGES": "Ville de Bussy-Saint-Georges",
  "CA Cergy-Pontoise": "Agglomération Cergy-Pontoise",
  "CA Saint-Germain Boucles de Seine":
    "Agglomération Saint-Germain Boucles de Seine",
  CD77: "Département de Seine-et-Marne",
  CD78: "Département des Yvelines",
  CD91: "Département de l’Essonne",
  CD92: "Département des Hauts-de-Seine",
  CD93: "Département de Seine-Saint-Denis",
  CD94: "Département du Val-de-Marne",
  CD95: "Département du Val-d’Oise",
  CERGY: "Ville de Cergy",
  "CERGY-PONTOISE": "Agglomération Cergy-Pontoise",
  "CHARENTON-LE-PONT": "Ville de Charenton-Le-Pont",
  "CHARENTON-LE-PONT/CD94/DIRIF":
    "Ville de Charenton-Le-Pont/Département du Val-de-Marne/Direction des routes d’Île-de-France (DIRIF)",
  "CHARENTON-LE-PONT/VNF":
    "Ville de Charenton-Le-Pont/Voies Navigables de France ",
  CHATILLON: "Ville de Châtillon",
  Châtillon: "Ville de Châtillon",
  CHELLES: "Ville de Chelles",
  "Chevilly-Larue": "Ville de Chevilly-Larue",
  "CHOISY-LE-ROI": "Ville de Choisy-Le-Roi",
  CLAMART: "Ville de Clamart",
  "Département des Yvelines": "Département des Yvelines",
  Courbevoie: "Ville de Courbevoie",
  "CU Grand Paris Seine et Oise": "Communauté urbaine Grand Paris Seine & Oise",
  DIRIF: "Direction des routes d’Île-de-France (DIRIF)",
  DRAVEIL: "Ville de Draveil",
  ECOUEN: "Ville d’Écouen",
  "EP PARIS LA DEFENSE": "Établissement public Paris La Défense",
  "EPA France":
    "Établissement public d’aménagement France (EpaFrance) (Aménageur national)",
  "EPA PARIS SACLAY":
    "Établissement public d’aménagement Paris-Saclay (EPAPS) (Aménageur régional)",
  EPAFRANCE:
    "Établissement public d’aménagement France (EpaFrance) (Aménageur national)",
  EPAMARNE:
    "Établissement public d’aménagement Marne (EpaMarne) (Aménageur régional)",
  "Evry Courcouronnes": "Ville d’Évry-Courcouronnes",
  GPA: "Grand Paris Aménagement (Aménageur régional)",
  "GRAND PARIS SEINE OUEST": "Territoire Grand Paris Seine Ouest (GPSO)",
  "GRAND PARIS SUD": "Territoire Grand Paris Sud Est Avenir (GPSEA)",
  "GRAND PARIS SUD EST AVENIR": "Territoire Grand Paris Sud Est Avenir (GPSEA)",
  "GRAND-ORLY SEINE BIEVRE": "Territoire Grand Orly Seine Bièvre (GPSO)",
  HAROPA: "Haropa",
  IDFM: "Île-de-France Mobilité",
  "IVRY-SUR-SEINE": "Ville d’Ivry-Sur-Seine",
  "L’Haÿ-les-Roses": "Ville de L’Haÿ-Les-Roses",
  "LE BLANC-MESNIL": "Ville du Blanc-Mesnil",
  "Le Plessis-Robinson": "Ville du Plessis-Robinson",
  "MAISONS-ALFORT": "Ville de Maisons-Alfort",
  "Maisons-Laffitte": "Ville de Maisons-Laffitte",
  "MARNE ET GONDOIRE": "Agglomération Marne et Gondoire",
  MASSY: "Ville de Massy",
  Nanterre: "Ville de Nanterre",
  "NEUILLY-SUR-MARNE": "Ville de Neuilly-Sur-Marne",
  "Neuilly-sur-Seine": "Ville de Neuilly-Sur-Seine",
  NR: "Non renseigné",
  null: "Non renseigné",
  ONF: "Office National des Forêts (ONF)",
  "Parc de la Vilette": "Établissement public du Parc de la Villette",
  PARIS: "Ville de Paris",
  Paris: "Ville de Paris",
  "Paris La Défense": "Établissement public territorial Paris La Défense",
  "PARIS SACLAY": "Agglomération Paris-Saclay",
  "PARIS VALLEE DE LA MARNE": "Agglomération Paris Vallée de la Marne",
  "PIERREFITTE-SUR-SEINE": "Ville de Pierrefitte-sur-Seine",
  "Plaine Commune": "Territoire Plaine Commune",
  "PLAINE COMMUNE": "Territoire Plaine Commune",
  PLD: "Établissement public Paris La Défense",
  "PORTES BRIARDES": "Communauté de communes des Portes Briardes",
  PUTEAUX: "Ville de Puteaux",
  "RIS-ORANGIS": "Ville de Ris-Orangis",
  "Ris-Orangis": "Ville de Ris-Orangis",
  "ROISSY PAYS DE FRANCE": "Agglomération Roissy Pays de France",
  "SADEV 94": "Sadev 94 (aménageur départemental)",
  "SAINT-GERMAIN BOUCLES DE SEINE":
    "Agglomération Saint-Germain Boucles de Seine",
  "SAINT-QUENTIN-EN-YVELINES": "Agglomération Saint-Quentin-en-Yvelines",
  "Saint-Quentin-en-Yvelines": "Agglomération Saint-Quentin-en-Yvelines",
  SAMNA: "Société d’économie mixte de la ville de Nanterre (SEMNA)",
  Sceaux: "Ville de Sceaux",
  SEMNA: "Société d’économie mixte de la ville de Nanterre (SEMNA)",
  SIAAP:
    "Service interdépartemental pour l’assainissement de l’agglomération parisienne (SIAAP)",
  SNCF: "SNCF",
  "SNCF Réseau": "SNCF Réseau",
  "SNCF Réseau - EOLE": "SNCF Réseau – Projet EOLE prolongement du RER E",
  Thiais: "Ville de Thiais",
  TORCY: "Ville de Torcy",
  "VELIZY-VILLACOUBLAY": "Ville de Vélizy-Villacoublay",
  "VERRIERES-LE-BUISSON": "Ville de Verrières-le-Buisson",
  VERSAILLES: "Ville de Versailles",
  "VILLENEUVE-LE-ROI": "Ville de Villeneuve-Le-Roi",
  VIROFLAY: "Ville de Viroflay",
};
