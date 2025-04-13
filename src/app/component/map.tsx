"use client";
import React, { useRef, useEffect, useState } from "react";
import maplibregl, { LngLatBounds, MapGeoJSONFeature } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import _ from "lodash";
import { FeatureCollection, LineString } from "@turf/helpers";
import { Level, TronçonProperties, TronçonStatus } from "../types";
import {
  fadedStatusColor,
  fadedBorderStatusColor,
  borderStatusColor,
  statusColor,
} from "@/utils/constants";
import {
  baseLayer,
  exceptedVariants,
  onlyDoneVariants,
  onlyUpcomingVariants,
  colorFromStatus,
  showWhen,
  hideWhen,
  width,
  widthFromStatus,
} from "../style_helpers";
import { Protocol } from "pmtiles";

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

  let protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);

  useEffect(() => {
    if (map.current) return;

    // prettier-ignore
    const newMap = new maplibregl.Map({
      container: mapContainer.current || "",
      bounds: new LngLatBounds(bounds),
      style: `style.json`,
    })
    newMap.on("load", () => {
        newMap
          .addSource("vif", {
            type: "geojson",
            data: segments,
            promoteId: "id",
          })
          .addLayer({
            ...baseLayer("base-outer-white"),
            paint: {
              ...width(10, 30),
              "line-color": "#fff",
            }
          })
          .addLayer({
            ...baseLayer("hover-overlay"),
            paint: {
              ...width(10, 30),
              "line-color": "#aaa",
              ...showWhen("hover")
            },
          })
          .addLayer({
            ...baseLayer("outline-grey-inactive"),
            paint: {
              ...width(7, 16),
              ...colorFromStatus(fadedBorderStatusColor),
            },
          })
          .addLayer({
            ...baseLayer("inner-white"),
            paint: {
              ...width(5, 10),
              "line-color": "#fff",
            },
          })
          .addLayer({
            ...baseLayer("couleur-inactive-variant-done", false),
            ...onlyDoneVariants,
            paint: {
              "line-dasharray" : [.4, .4],
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(fadedStatusColor),
            },
          })
          .addLayer({
            ...baseLayer("couleur-inactive-variant-upcoming", false),
            ...onlyUpcomingVariants,
            paint: {
              "line-dasharray" : [1, 1],
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(fadedStatusColor),
            },
          })
          .addLayer({
            ...baseLayer("couleur-inactive"),
            ...exceptedVariants,
            paint: {
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(fadedStatusColor),
              ...showWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("outline-grey-active"),
            paint: {
              ...width(7, 16),
              ...colorFromStatus(borderStatusColor),
              ...hideWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("inner-white-active"),
            paint: {
              ...width(5, 10),
              "line-color": "#fff",
              ...hideWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("couleur-active-variant-done", false),
            ...onlyDoneVariants,
            paint: {
              "line-dasharray" : [.4, .4],
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(statusColor),
              ...hideWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("couleur-active-variant-upcoming", false),
            ...onlyUpcomingVariants,
            paint: {
              "line-dasharray" : [1, 1],
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(statusColor),
              ...hideWhen("inactive")
            },
          })
          .addLayer({
            ...baseLayer("couleur-active"),
            ...exceptedVariants,
            paint: {
              ...widthFromStatus(4, 2.5, 10, 3),
              ...colorFromStatus(statusColor),
              ...hideWhen("inactive")
            },
          });

          newMap.moveLayer("Town labels");
          newMap.moveLayer("City labels");
        })
      newMap.on("moveend", () => { setMapViewport(newMap.getBounds()) })
      newMap.on("click", () => setHash("region") )
      newMap.on("click", "base-outer-white", (tronçon) => {
        if (tronçon.features !== undefined && tronçon.features.length > 0) {
          setHash(`segment/${tronçon.features[0].id}`);
        }
      })
      newMap.on("mousemove", "base-outer-white", (tronçon) => {
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
      })
      newMap.on('mouseleave', 'base-outer-white', () => {
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
