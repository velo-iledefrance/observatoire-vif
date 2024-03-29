import Link from "next/link";
import { Level, RoutesMap } from "../types";

export default function RouteList({
  routes,
  level,
  setHash,
}: {
  routes: RoutesMap;
  level: Level;
  setHash: (hash: string) => void;
}) {
  return (
    <section className="section route-list">
      <div className="vif-container">
        <h2 className="title is-4 has-text-centered has-text-weight-bold">
          Informations par&nbsp;ligne
        </h2>
        <div className="route-list-icons">
          {Object.keys(routes).map((route) => (
            <button
              key={route}
              className="button route-button"
              onClick={() => setHash(`route/${route}`)}
              aria-pressed={
                level.level === "route" && level.props.code === route
              }
            >
              <div
                className="route-code route-code--small"
                style={
                  {
                    "--route-color": `var(--route-color-${route})`,
                  } as React.CSSProperties
                }
              >
                {route}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
