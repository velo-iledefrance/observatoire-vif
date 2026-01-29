"use client";
import Map from "./map";
import RouteList from "./routes_list";
import { useEffect, useState } from "react";
import { Level, GlobalData, TronçonProperties } from "../types";
import RouteDetails from "./route_details";
import NetworkInfo from "./network_info";
import Segment from "./segment";
import About from "./about";
import _ from "lodash";
import { Feature, LineString } from "geojson";

function currentDetail(
  level: Level,
  setHash: (hash: string) => void,
) {
  let current;
  switch (level.level) {
    case "route":
      current = <RouteDetails route={level.props} setHash={setHash} />;
      break;
    case "segment":
      current = <Segment segment={level.props} setHash={setHash} />;
      break;
  }
  return current;
}

export default function StateHolder ({ data }: { data: GlobalData }) {
  _.forEach(data.phases, (stat, phase) => {
    console.log(`Statistiques pour la phase ${phase}`);
    console.log(`Longueur totale considérée : ${stat.total} mètres`);
    console.log(stat.stats);
  });

  _.forEach(data.departementStats, (stat, dep) => {
    console.log(`Statistiques pour le département ${dep}`);
    console.log(`Longueur totale considérée : ${stat.total} mètres`);
    console.log(stat.stats);
  });

  const [bounds, setBounds] = useState(data.globalBounds);
  const [hash, setHash] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [level, setLevel] = useState<Level>({ level: "region" });

  // After the initial load, explicitely trigger a re-render if the location hash is present.
  //
  // The proper solution for this would be to initialize the hash state with `window ? window.location.hash : ""`.
  // But then Next.js complains that the server-side-rendered content (which doesn't have access to the URL hash)
  // differs from the hydrated client content (which can access the URL hash).
  //
  // This is technically true: because the URL hash is never sent to the server, the server can't generate the
  // proper map for the given hash (the global zoomed-out map will always be returned by the server).
  // However in our case this is the desired behavior: we want the full map to be displayed first, and then
  // zoom on the location specified by the URL hash.
  //
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHash(window.location.hash), []);

  // When the hash changes, update the external APIs.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.hash = hash;
  }, [hash]);

  if (hash !== prevHash) {
    setPrevHash(hash);
    const [level, id] = hash.replace("#", "").split("/");

    if (level === "" || level === "region") {
      setBounds(data.globalBounds);
      setLevel({ level: "region" });
    } else if (level === "phase" && id !== null) {
      const props = data.phases[id];
      setBounds(data.globalBounds); // prefer the global bounds to the phase bounds (props.bounds)
      setLevel({ level: "phase", props });
    } else if (level === "route" && id !== null) {
      const props = data.routes[id];
      setBounds(props.bounds);
      setLevel({ level: "route", props });
    } else if (level === "segment") {
      const tronçon = data.tronçons.features.find(
        (f: Feature<LineString, TronçonProperties>) => f.properties.id === id,
      );
      if (tronçon !== undefined && tronçon.bbox !== undefined) {
        const [xmin, ymin, xmax, ymax] = tronçon.bbox;
        setBounds([xmin, ymin, xmax, ymax]);
        setLevel({ level: "segment", props: tronçon.properties });
      } else {
        console.warn("something weird", tronçon);
      }
    }
  };

  return (
    <>
      <Map
        bounds={bounds}
        segments={data.tronçons}
        level={level}
        setHash={setHash}
      />
      <div className="vif-panel">
        <NetworkInfo globalStats={data.globalStats} phases={data.phases} level={level} setHash={setHash} />
        <RouteList routes={data.routes} level={level} setHash={setHash} />
        <About />
        <div className="vif-detail">{currentDetail(level, setHash)}</div>
      </div>
    </>
  );
}
