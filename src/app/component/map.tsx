"use client";
import React, { useRef, useEffect, useState } from "react";
import maplibregl, { LngLatBounds, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import _ from "lodash";
import { FeatureCollection, LineString } from "@turf/helpers";
import { Level, TronçonProperties, TronçonStatus } from "../types";
import { fadedStatusColor, fadedBorderStatusColor, borderStatusColor, statusColor } from "@/utils/constants";
import { baseLayer, exceptedVariants, onlyVariants, colorFromStatus, showWhen, hideWhen} from "../style_helpers";

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
        inactive: !active
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
          .addLayer({
            ...baseLayer("base-outer-white"),
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 10,
                15, 30,
              ],
              "line-color": "#fff",
            }
          })
          .addLayer({
            ...baseLayer("hover-overlay"),
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 10,
                15, 30,
              ],
              "line-color": "#aaa",
              ...showWhen("hover")
            },
          })
          .addLayer({
            ...baseLayer("outline-grey-inactive"),
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 7,
                15, 16
              ],
              ...colorFromStatus(fadedBorderStatusColor),
            },
          })
          .addLayer({
            ...baseLayer("outline-grey-active"),
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 7,
                15, 16
              ],
              ...colorFromStatus(borderStatusColor),
              ...hideWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("inner-white"),
            paint: {
              "line-width": ["interpolate", ["linear"], ["zoom"],
                10, 5,
                15, 10
              ],
              "line-color": "#fff",
            },
          })
          .addLayer({
            ...baseLayer("couleur-inactive"),
            ...exceptedVariants,
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 2.5,
                  4,
                ],
                15, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 3,
                  10,
                ],
              ],
              ...colorFromStatus(fadedStatusColor),
              ...showWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("couleur-active"),
            ...exceptedVariants,
            paint: {
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // at zoom level 10, the line-width is either 5 or 3
                10, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 2.5,
                  4,
                ],
                15, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 3,
                  10,
                ],
              ],
              ...colorFromStatus(statusColor),
              // We cannot use feature-state in filter, only in paint
              // Hence we hide the active layer with opacity
              "line-opacity": [
                "case",
                ["boolean", ["feature-state", "inactive"], false],
                0.0,
                1,
              ],
            },
          })
          .addLayer({
            ...baseLayer("couleur-inactive-variant", false),
            ...onlyVariants,
            paint: {
              "line-dasharray" : [1, 1],
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 2.5,
                  4,
                ],
                15, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 3,
                  10,
                ],
              ],
              ...colorFromStatus(fadedStatusColor),
            },
          })
          .addLayer({
            ...baseLayer("couleur-active-variant", false),
            ...onlyVariants,
            paint: {
              "line-dasharray" : [1, 1],
              "line-width": [
                "interpolate",
                ["linear"],
                ["zoom"],
                // at zoom level 10, the line-width is either 5 or 3
                10, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 2.5,
                  4,
                ],
                15, [ "match", ["get", "status"],
                  [TronçonStatus.Planned, TronçonStatus.Blocked], 3,
                  10,
                ],
              ],
              ...colorFromStatus(statusColor),
              ...hideWhen("inactive")
            },
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
      var skip = false;

      if (oldLevel.current.level === "segment" && level.level === "region") {
        // When exiting a segment, only zoom out a bit, do not return to the whole region.
        toBounds = oldBounds.current;
        const currentBounds = map.current.getBounds();
        if (
          currentBounds.contains({ lon: toBounds[0], lat: toBounds[1] }) &&
          currentBounds.contains({ lat: toBounds[2], lon: toBounds[3] })
        ) {
          // Don’t zoom in if the user zoomed out themselves
          skip = true;
        }
        paddingRatio = 2.2;
      } else if (level.level === "segment") {
        paddingRatio = 4;
      } else if (level.level === "route") {
        paddingRatio = 10;
      } else {
        paddingRatio = 1000;
      }

      if (!skip) {
        setBounds(map.current, toBounds, paddingRatio);
      }

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
