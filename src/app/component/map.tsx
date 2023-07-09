"use client";
import React, { useRef, useEffect } from "react";
import maplibregl, { LngLatBounds, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../page.module.css";
import _ from "lodash";
import { FeatureCollection, LineString } from "@turf/helpers";
import { Level, TronçonProperties, TronçonStatus } from "../types";
import { useRouter } from "next/navigation";
import { statusColor } from "@/utils/constants";

function isActive(level: Level, feature: MapGeoJSONFeature): boolean {
  if (level.level === "route") {
    return feature.properties.route === level.props.code;
  } else if (level.level === "segment") {
    return feature.properties.id === level.props.id;
  } else {
    return true;
  }
}

function setActiveSegments(map: maplibregl.Map, level: Level) {
  map.querySourceFeatures("vif").forEach((feature) => {
    map.setFeatureState(
      {
        id: feature.id,
        source: "vif",
      },
      { active: isActive(level, feature) }
    );
  });

  map.querySourceFeatures("outline").forEach((feature) => {
    map.setFeatureState(
      {
        id: feature.id,
        source: "outline",
      },
      { active: isActive(level, feature) }
    );
  });
}

type Props = {
  outlines: FeatureCollection;
  variantOutlines: FeatureCollection;
  bounds: [number, number, number, number];
  segments: FeatureCollection<LineString, TronçonProperties>;
  level: Level;
};

export default function Map({
  outlines,
  variantOutlines,
  bounds,
  segments,
  level,
}: Props) {
  const mapContainer = useRef<null | HTMLElement>(null);
  const map = useRef<null | maplibregl.Map>(null);
  const router = useRouter();

  useEffect(() => {
    if (map.current) return;

    const newMap = new maplibregl.Map({
      container: mapContainer.current || "",
      style: `https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    })
      .on("load", () => {
        newMap.fitBounds(new LngLatBounds(bounds));
        newMap
          .addSource("vif", {
            type: "geojson",
            data: segments,
            promoteId: "id",
          })
          .addSource("outline", {
            type: "geojson",
            data: outlines,
            generateId: true,
          })
          .addSource("variant-outline", {
            type: "geojson",
            data: variantOutlines,
          })
          .addLayer({
            id: "variant-outline",
            source: "variant-outline",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
              "line-gap-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                3,
                15,
                10,
              ],
              "line-color": "#7f7f7f",
              "line-opacity": 0.5,
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({
            id: "base-outer",
            source: "outline",
            type: "line",
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                8,
                15,
                30,
              ],
              "line-color": "#fff",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({
            id: "base-inner",
            source: "outline",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
              "line-gap-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                3,
                15,
                10,
              ],
              "line-color": "#7f7f7f",
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                1,
                0.5,
              ],
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({
            id: "variantes",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 3],
              "line-dasharray": [2, 1],
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                1,
                0.2,
              ],
            },
            filter: ["get", "variant"],
          })
          .addLayer({
            id: "couleur",
            source: "vif",
            type: "line",
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // at zoom level 10, the line-width is either 3 or 2
                10,
                [
                  "match",
                  ["get", "status"],
                  TronçonStatus.PreExisting,
                  3,
                  TronçonStatus.Built,
                  3,
                  TronçonStatus.Building,
                  3,
                  2,
                ],
                15,
                [
                  "match",
                  ["get", "status"],
                  TronçonStatus.PreExisting,
                  10,
                  TronçonStatus.Built,
                  10,
                  TronçonStatus.Building,
                  10,
                  6,
                ],
              ],
              "line-color": [
                "match",
                ["get", "status"],
                TronçonStatus.PreExisting,
                statusColor[TronçonStatus.PreExisting],
                TronçonStatus.Built,
                statusColor[TronçonStatus.Built],
                TronçonStatus.Building,
                statusColor[TronçonStatus.Building],
                TronçonStatus.Planned,
                statusColor[TronçonStatus.Planned],
                TronçonStatus.Blocked,
                statusColor[TronçonStatus.Blocked],
                statusColor[TronçonStatus.Unknown], // default value
              ],
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "active"], false],
                1,
                0.2,
              ],
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            filter: ["!", ["get", "variant"]],
          });
      })
      .on("click", "couleur", (tronçon) => {
        if (tronçon.features !== undefined && tronçon.features.length > 0) {
          router.push(`?level=segment&id=${tronçon.features[0].id}`);
        }
      });
    setActiveSegments(newMap, level);
    map.current = newMap;
  });

  useEffect(() => {
    map.current?.fitBounds(bounds, { padding: 10 });
  }, [bounds]);

  useEffect(() => {
    if (map.current !== null) {
      setActiveSegments(map.current, level);
    }
  }, [level]);

  return (
    <div ref={(el) => (mapContainer.current = el)} className={styles.map} />
  );
}
