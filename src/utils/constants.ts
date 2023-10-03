import { TronçonStatus, TypeMOA } from "@/app/types";
import Color from "color";
import _ from "lodash";

export const statusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant au 01/01/2022",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "En travaux",
  [TronçonStatus.Planned]: "En cours de discussion",
  [TronçonStatus.Blocked]: "Bloqué",
  [TronçonStatus.SecondPhase]: "Phase 2 (2030)",
  [TronçonStatus.Unknown]: "Inconnu",
};

export const shortStatusLabel = {
  [TronçonStatus.PreExisting]: "Préexistant",
  [TronçonStatus.Built]: "Livré",
  [TronçonStatus.Building]: "En travaux",
  [TronçonStatus.Planned]: "En discussion",
  [TronçonStatus.Blocked]: "Bloqué",
  [TronçonStatus.SecondPhase]: "Phase 2",
  [TronçonStatus.Unknown]: "Inconnu",
};

export const statusColor = {
  [TronçonStatus.PreExisting]: "#B6D2BE",
  [TronçonStatus.Built]: "#0BBC3F",
  [TronçonStatus.Building]: "#79E70F",
  [TronçonStatus.Planned]: "#7FCCDD",
  [TronçonStatus.Blocked]: "#E95353",
  [TronçonStatus.SecondPhase]: "#FFF",
  [TronçonStatus.Unknown]: "#E7E7E7",
  ["Background"]: "#ddddd5",
};

export const fadedStatusColor = _.mapValues(statusColor, c => Color(c).lighten(0.2).hex());
export const statusIndex = {
  [TronçonStatus.PreExisting]: 2,
  [TronçonStatus.Built]: 5,
  [TronçonStatus.Building]: 4,
  [TronçonStatus.Planned]: 3,
  [TronçonStatus.Blocked]: 6,
  [TronçonStatus.SecondPhase]: 0,
  [TronçonStatus.Unknown]: 1,
}

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

export const moaName: { [index: string]: string } = {
  ADP: "Aéroports de Paris",
  AEV: "Île-de-France Nature (ex Agence des espaces verts de la Région)",
  "CA Cergy-Pontoise": "Agglomération Cergy-Pontoise",
  CACP: "Agglomération Cergy-Pontoise",
  "CA de Marne et Gondoire": "Agglomération Marne et Gondoire",
  "CA Marne & Gondoire": "Agglomération Marne et Gondoire",
  "CA Paris Saclay": "Agglomération Paris-Saclay",
  "CA Paris Vallée de la Marne": "Agglomération Paris Vallée de la Marne",
  CARPF: "Agglomération Roissy Pays de France",
  "CA Saint-Germain Boucles de Seine":
    "Agglomération Saint-Germain Boucles de Seine",
  CD77: "Département de Seine-et-Marne",
  CD78: "Département des Yvelines",
  CD91: "Département de l’Essonne",
  "CD 92": "Département des Hauts-de-Seine",
  CD92: "Département des Hauts-de-Seine",
  CD93: "Département de Seine-Saint-Denis",
  CD94: "Département du Val-de-Marne",
  CD95: "Département du Val-d’Oise",
  Cergy: "Ville de Cergy",
  "Charenton-le-Pont": "Ville de Charenton-le-Pont",
  "Charenton-le-Pont/CD94/DIRIF":
    "Ville de Charenton-le-Pont / Département du Val-de-Marne / Direction des routes d’Île-de-France",
  "Charenton-le-Pont/VNF":
    "Ville de Charenton-le-Pont / Voies Navigables de France",
  Châtillon: "Ville de Châtillon",
  Chelles: "Ville de Chelles",
  "Chevilly-Larue": "Ville de Chevilly-Larue",
  "Choisy-le-Roi": "Ville de Choisy-le-Roi",
  Clamart: "Ville de Clamart",
  "Communauté de Communes des Portes Briardes":
    "Communauté de communes des Portes Briardes",
  Courbevoie: "Ville de Courbevoie",
  "CU Grand Paris Seine et Oise":
    "Communauté urbaine Grand Paris Seine et Oise (GPS&O)",
  DIRIF: "Direction des routes d’Île-de-France (DIRIF)",
  Draveil: "Ville de Draveil",
  Ecouen: "Ville d’Écouen",
  "EPA France":
    "Établissement public d’aménagement France (EpaFrance) (Aménageur national)",
  Epamarne:
    "Établissement public d’aménagement Marne (EpaMarne) (Aménageur régional)",
  "EPA Marne":
    "Établissement public d’aménagement Marne (EpaMarne) (Aménageur régional)",
  EPAMARNE:
    "Établissement public d’aménagement Marne (EpaMarne) (Aménageur régional)",
  EPAPS:
    "Établissement public d’aménagement Paris-Saclay (EPAPS) (Aménageur régional)",
  "EPT GOSB": "Territoire Grand Orly Seine Bièvre (GPSO)",
  "EPT GPSEA": "Territoire Grand Paris Sud Est Avenir (GPSEA)",
  "Evry Courcouronnes": "Ville d’Évry-Courcouronnes",
  GPA: "Grand Paris Aménagement (Aménageur régional)",
  GPSEA: "Territoire Grand Paris Sud Est Avenir",
  "Grand Paris Sud": "Agglomération Grand Paris Sud",
  HAROPA: "HAROPA – Port fluvio-maritime de l’axe Seine",
  IDFM: "Île-de-France Mobilités (IDFM)",
  "Ivry-sur-Seine": "Ville d’Ivry-sur-Seine",
  "Le Blanc-Mesnil": "Ville du Blanc-Mesnil",
  "Le Plessis-Robinson": "Ville du Plessis-Robinsons",
  "L’Haÿ-les-Roses": "Ville de l’Haÿ-les-Roses",
  "Maisons-Alfort": "Ville de Maison-Alfort",
  "Maisons-Laffitte": "Ville de Maisons-Laffitte",
  Massy: "Ville de Massy",
  Nanterre: "Ville de Nanterre",
  "Neuilly-sur-Marne": "Ville de Neuilly-sur-Marne",
  "Neuilly-sur-Seine": "Ville de Neuilly-sur-Seine",
  NR: "Non renseigné",
  null: "Non renseigné",
  ONF: "Office National des Forêts (ONF)",
  "Parc de la Vilette": "Établissement public du Parc de la Villette",
  Paris: "Ville de Paris",
  "Paris La Défense": "Établissement public Paris La Défense",
  Pierrefitte: "Ville de Pierrefitte",
  "Plaine Commune": "Territoire Plaine Commune",
  PLD: "Établissement public Paris La Défense",
  "Ris-Orangis": "Ville de Ris-Orangis",
  "Saint-Quentin-en-Yvelines": "Agglomération Saint-Quentin-en-Yvelines",
  SAMNA: "Société d’économie mixte de la ville de Nanterre (SEMNA)",
  Sceaux: "Ville de Sceaux",
  SIAAP:
    "Service interdépartemental pour l’assainissement de l’agglomération parisienne (SIAAP),",
  SNCF: "SNCF",
  "SNCF Réseau": "SNCF Réseau",
  "SNCF Réseau – EOLE": "SNCF Réseau – Projet EOLE prolongement du RER E",
  Thiais: "Ville de Thiais",
  Torcy: "Ville de Torcy",
  "Vélizy-Villacoublay": "Ville de Vélizy-Villacoublay",
  "Verrières le Buisson": "Ville de Verrières-le-Buisson",
  "Verrières-le-Buisson": "Ville de Verrières-le-Buisson",
  Versailles: "Ville de Versailles",
  Viroflay: "Ville de Viroflay",
};
