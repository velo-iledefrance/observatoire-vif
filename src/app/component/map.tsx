"use client";
import React, { useRef, useEffect, useState } from "react";
import maplibregl, { LngLatBounds, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import _ from "lodash";
import { FeatureCollection, LineString } from "@turf/helpers";
import { Level, TronçonProperties, TronçonStatus } from "../types";
import { fadedStatusColor, statusColor } from "@/utils/constants";

function isActive(level: Level, feature: MapGeoJSONFeature): boolean {
  if (level.level === "route") {
    return JSON.parse(feature.properties.route).includes(level.props.code);
  } else if (level.level === "segment") {
    return feature.properties.id === level.props.id;
  } else {
    return true;
  }
}

function setBounds(
  map: maplibregl.Map,
  bounds: [number, number, number, number],
  paddingRatio: number,
) {
  const xPadding = map.getContainer().offsetWidth / paddingRatio;
  const yPadding = map.getContainer().offsetHeight / paddingRatio;
  map.fitBounds(bounds, {
    padding: {
      top: yPadding,
      bottom: yPadding,
      left: xPadding,
      right: xPadding,
    },
  });
}

function setActiveSegments(map: maplibregl.Map, level: Level) {
  const features = map.querySourceFeatures("vif"); // querySourceFeatures depends on the current map viewport
  features.forEach((feature) => {
    const active = isActive(level, feature);
    map.setFeatureState(
      {
        id: feature.id,
        source: "vif",
      },
      {
        inactive: !active,
        "active-outline": active && level.level !== "region",
      },
    );
  });
}

type Props = {
  bounds: [number, number, number, number];
  segments: FeatureCollection<LineString, TronçonProperties>;
  level: Level;
  setHash: (hash: string) => void;
};

export default function Map({ bounds, segments, level, setHash }: Props) {
  const mapContainer = useRef<null | HTMLElement>(null);
  const map = useRef<null | maplibregl.Map>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapViewport, setMapViewport] = useState<null | LngLatBounds>(null);
  let hoveredSegment: null | string | number = null;

  useEffect(() => {
    if (map.current) return;

    // prettier-ignore
    const newMap = new maplibregl.Map({
      container: mapContainer.current || "",
      bounds: new LngLatBounds(bounds),
      style: `https://api.maptiler.com/maps/db0b0c2f-dcff-45fd-aa4d-0ddb0228e342/style.json?key=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    })
      .on("load", () => {
        newMap
          .addSource("vif", {
            type: "geojson",
            data: segments,
            promoteId: "id",
          })
          .addLayer({ id: "base-outer-white",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 8,
                15, 30,
              ],
              "line-color": "#fff",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({ id: "hover-overlay",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 8,
                15, 30,
              ],
              "line-color": "#aaa",
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                1,
                0,
              ],
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({ id: "variant-outline-grey",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 5,
                15, 16
              ],
              "line-color": "#7f7f7f",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            filter: ["get", "variant"],
          })
          .addLayer({ id: "outline-grey-inactive",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 5,
                15, 16
              ],
              "line-color": "#7f7f7f",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            filter: ["!", ["get", "variant"]],
          })
          .addLayer({ id: "outline-grey-active",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 7,
                15, 20
              ],
              "line-color": "#4c4c4c",
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "active-outline"], false],
                1,
                0.0,
              ],
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
          })
          .addLayer({ id: "variant-inner-white",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 4,
                15, 10
              ],
              "line-color": "#fff",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            filter: ["get", "variant"],
          })
          .addLayer({ id: "inner-white",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 4,
                15, 10
              ],
              "line-color": "#fff",
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            filter: ["!", ["get", "variant"]],
          })
          .addLayer({ id: "variantes",
            source: "vif",
            type: "line",
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 1.2,
                15, 4
              ],
              "line-dasharray": [2, 1],
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "inactive"], false],
                0.5,
                1,
              ],
              "line-color": statusColor[TronçonStatus.Planned],
            },
            filter: ["get", "variant"],
          })
          .addLayer({ id: "couleur-inactive",
            source: "vif",
            type: "line",
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // at zoom level 10, the line-width is either 3 or 2
                10, [ "match", ["get", "status"],
                  TronçonStatus.PreExisting, 3,
                  TronçonStatus.Built, 3,
                  TronçonStatus.Building, 3,
                  TronçonStatus.Blocked, 3,
                  2,
                ],
                15, [ "match", ["get", "status"],
                  TronçonStatus.PreExisting, 10,
                  TronçonStatus.Built, 10,
                  TronçonStatus.Building, 10,
                  TronçonStatus.Blocked, 10,
                  6,
                ],
              ],
              "line-color": [ "get", ["get", "status"], ["literal", fadedStatusColor] ],
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            filter: ["!", ["get", "variant"]],
          })
          .addLayer({ id: "couleur-active",
            source: "vif",
            type: "line",
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // at zoom level 10, the line-width is either 3 or 2
                10, [ "match", ["get", "status"],
                  TronçonStatus.PreExisting, 3,
                  TronçonStatus.Built, 3,
                  TronçonStatus.Building, 3,
                  TronçonStatus.Blocked, 3,
                  2,
                ],
                15, [ "match", ["get", "status"],
                  TronçonStatus.PreExisting, 10,
                  TronçonStatus.Built, 10,
                  TronçonStatus.Building, 10,
                  TronçonStatus.Blocked, 10,
                  6,
                ],
              ],
              "line-color": [ "get", ["get", "status"], ["literal", statusColor] ],
              // We cannot use feature-state in filter, only in paint
              // Hence we hide the active layer with opacity
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "inactive"], false],
                0.0,
                1,
              ],
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            filter: ["!", ["get", "variant"]],
          });

          newMap.moveLayer("Town labels");
          newMap.moveLayer("City labels");
        })
      .on("moveend", () => { setMapViewport(newMap.getBounds()) })
      .on("click", () => setHash("region") )
      .on("click", "base-outer-white", (tronçon) => {
        if (tronçon.features !== undefined && tronçon.features.length > 0) {
          setHash(`segment/${tronçon.features[0].id}`);
        }
      }).on("mousemove", "base-outer-white", (tronçon) => {
        if (tronçon.features !== undefined && tronçon.features.length > 0) {
          newMap.getCanvas().style.cursor = "pointer";
          if (hoveredSegment) {
            newMap.setFeatureState(
                {source: 'vif', id: hoveredSegment},
                {hover: false}
            );
          }
          hoveredSegment = tronçon.features[0].id || null;
          newMap.setFeatureState(
            {source: 'vif', id: tronçon.features[0].id},
            {hover: true}
          );
        }
      }).on('mouseleave', 'base-outer-white', () => {
        newMap.getCanvas().style.cursor = "";
        if (hoveredSegment) {
            newMap.setFeatureState(
                {source: 'vif', id: hoveredSegment},
                {hover: false}
            );
        }
        hoveredSegment = null;
      });

    newMap.once("idle", () => {
      setMapReady(true);
    });

    map.current = newMap;
  });

  const oldLevel = useRef<Level>(level);
  const oldBounds = useRef<[number, number, number, number]>(bounds);

  useEffect(() => {
    if (map.current !== null) {
      var toBounds = bounds;
      var paddingRatio;

      if (oldLevel.current.level === "segment" && level.level === "region") {
        // When exiting a segment, only zoom out a bit, do not return to the whole region.
        toBounds = oldBounds.current;
        paddingRatio = 2.2;
      } else if (level.level === "segment") {
        paddingRatio = 4;
      } else if (level.level === "route") {
        paddingRatio = 10;
      } else {
        paddingRatio = 1000;
      }

      setBounds(map.current, toBounds, paddingRatio);

      oldLevel.current = level;
      oldBounds.current = bounds;
    }
  }, [mapReady, level, bounds]);

  useEffect(() => {
    if (map.current !== null) {
      setActiveSegments(map.current, level);
    }
  }, [mapViewport, level]);

  return (
    <div ref={(el) => (mapContainer.current = el)} className="vif-map">
      <figure className="vif-map--logo">
        <img src="logo_cvidf.png" alt="Logo du collectif vélo Île-de-France" />
      </figure>
    </div>
  );
}
