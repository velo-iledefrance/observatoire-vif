import {
  Feature,
  FeatureCollection,
  featureCollection,
  lineString,
  LineString,
  MultiPolygon,
} from "@turf/helpers";
import _ from "lodash";
import {
  TronçonStatus,
  TronçonProperties,
  RoutesMap,
  Bounds,
  RouteStats,
  GlobalStats,
  TypeMOA,
  LengthStats,
  GlobalData,
  OriginalProperties,
  AdminExpressProperties,
} from "@/app/types";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import buffer from "@turf/buffer";
import booleanWithin from "@turf/boolean-within";
import communes from "../../data/communes-ile-de-france.geo.json";
import { featureEach } from "@turf/meta";

function status(
  niveau_validation: string,
  apport_rerv: string,
  phase: string,
  mort: boolean,
): TronçonStatus {
  if (mort) {
    return TronçonStatus.Blocked;
  } else if (apport_rerv === "Aménagement prééxistant") {
    return TronçonStatus.PreExisting;
  } else if (phase === "2 - 2030") {
    return TronçonStatus.SecondPhase;
  } else {
    return (
      {
        "A l'étude": TronçonStatus.Planned,
        "En travaux": TronçonStatus.Building,
        "Mis en service": TronçonStatus.Built,
      }[niveau_validation] || TronçonStatus.Unknown
    );
  }
}

function moaType(type: string): TypeMOA {
  switch (type) {
    case "Commune":
      return TypeMOA.Commune;
    case "Département":
      return TypeMOA.Departement;
    case "EPCI/EPT":
      return TypeMOA.EPCI;
    default:
      return TypeMOA.Unknown;
  }
}

async function fetchFromCocarto(): Promise<
  FeatureCollection<LineString, OriginalProperties>
> {
  const res = await fetch(
    `https://cocarto.com/fr/layers/4b724a41-d283-496b-b783-1fc8960a860e.geojson?token=${process.env.COCARTO_TOKEN}`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export async function prepareData(): Promise<GlobalData> {
  const troncons = await fetchFromCocarto();
  const casted = communes as FeatureCollection<
    MultiPolygon,
    AdminExpressProperties
  >;
  featureEach(casted, (feature) => {
    feature.geometry = buffer(feature, 0.05).geometry;
    feature.bbox = bbox(feature.geometry);
  });

  const troncon_route = _(troncons.features)
    .groupBy("properties.CODE_TRONCON")
    .mapValues((f) => _.map(f, "properties.NUM_LIGNE"))
    .value();

  const tronçonsArray: Feature<LineString, TronçonProperties>[] = // This will activate the closest `error.js` Error Boundary
    troncons.features
      .filter((feature) => !feature.properties.doublon)
      .map((feature) => {
        const commune = casted.features.find((commune) => {
          if (
            commune.bbox &&
            booleanWithin(feature, bboxPolygon(commune.bbox))
          ) {
            //  const buffered = buffer(feature.geometry, 0.001); // one meter
            //  const intersection = intersect(commune, buffered);
            return booleanWithin(feature, commune);
          } else {
            return false;
          }
        });
        const properties: TronçonProperties = {
          // A single tronçon can be used by many lines, the concatenation allows to deduplicate
          id: feature.properties.CODE_TRONCON,
          // When it is a "Variante" don’t count its length for any statistic, while "Variante initiale" means we DO use it for lengths stats
          length:
            feature.properties.NIVEAU_VALID_SUPPORT_VIAIRE === "Variante"
              ? 0
              : feature.properties.LONGUEUR,
          commune: commune?.properties.nom.replace(" Arrondissement", ""),
          route: troncon_route[feature.properties.CODE_TRONCON],
          status: status(
            feature.properties.NIVEAU_VALID_AMENAG || "",
            feature.properties.APPORT_RERV || "",
            feature.properties.PHASE,
            feature.properties["Bloqué"] || false,
          ),
          variant:
            !feature.properties["Bloqué"] &&
            feature.properties.APPORT_RERV !== "Aménagement prééxistant" &&
            feature.properties.PHASE === "1 - 2025" &&
            feature.properties.NIVEAU_VALID_AMENAG === "A l'étude" &&
            ["Variante", "Variante initiale"].includes(
              feature.properties.NIVEAU_VALID_SUPPORT_VIAIRE,
            ),
          typeMOA: moaType(feature.properties.TYPE_MOA || "autre"),
          moa: feature.properties.NOM_MOA || "",
          blockingCommune:
            feature.properties["Collectivité responsable du blocage"],
          comment: feature.properties.Commentaire,
        };

        return lineString(feature.geometry.coordinates, properties, {
          bbox: bbox(feature.geometry),
        });
      });

  const phase1Tronçons = tronçonsArray.filter(
    (feature) => feature.properties.status !== TronçonStatus.SecondPhase,
  );
  const [xmin, ymin, xmax, ymax] = bbox(featureCollection(phase1Tronçons));
  const globalBounds: Bounds = [xmin, ymin, xmax, ymax];

  const tronçons = featureCollection(tronçonsArray);

  const routeList = [
    "V1",
    "V2",
    "V3",
    "V4",
    "V5",
    "V6",
    "V7",
    "V8",
    "V9",
    "V10",
    "V20",
  ];

  const routes: RoutesMap = _.fromPairs(
    routeList.map((route) => [route, routeStats(route)]),
  );

  function routeStats(code: string): RouteStats {
    const t = _.filter(tronçonsArray, (feature) =>
      feature.properties.route.includes(code),
    );
    function length(status: TronçonStatus): number {
      return _(t)
        .filter((f) => f.properties.status === status)
        .sumBy("properties.length");
    }
    const stats: LengthStats = {
      [TronçonStatus.PreExisting]: length(TronçonStatus.PreExisting),
      [TronçonStatus.Built]: length(TronçonStatus.Built),
      [TronçonStatus.Building]: length(TronçonStatus.Building),
      [TronçonStatus.Planned]: length(TronçonStatus.Planned),
      [TronçonStatus.Blocked]: length(TronçonStatus.Blocked),
      [TronçonStatus.Unknown]: length(TronçonStatus.Unknown),
      [TronçonStatus.SecondPhase]: length(TronçonStatus.SecondPhase),
    };
    const total =
      _(t).map("properties.length").sum() - stats[TronçonStatus.SecondPhase];
    const [xmin, ymin, xmax, ymax] = bbox({
      type: "FeatureCollection",
      features: t,
    });
    return { code, stats, total, bounds: [xmin, ymin, xmax, ymax] };
  }

  function length(status: TronçonStatus): number {
    return _(tronçonsArray)
      .filter((f) => f.properties.status === status)
      .sumBy("properties.length");
  }
  const stats: LengthStats = {
    [TronçonStatus.PreExisting]: length(TronçonStatus.PreExisting),
    [TronçonStatus.Built]: length(TronçonStatus.Built),
    [TronçonStatus.Building]: length(TronçonStatus.Building),
    [TronçonStatus.Planned]: length(TronçonStatus.Planned),
    [TronçonStatus.Blocked]: length(TronçonStatus.Blocked),
    [TronçonStatus.Unknown]: length(TronçonStatus.Unknown),
    [TronçonStatus.SecondPhase]: length(TronçonStatus.SecondPhase),
  };
  const total =
    _(tronçonsArray).map("properties.length").sum() -
    stats[TronçonStatus.SecondPhase];

  const globalStats: GlobalStats = {
    stats,
    total,
  };

  return {
    globalStats,
    routes,
    tronçons,
    globalBounds,
  };
}
