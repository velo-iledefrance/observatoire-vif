import Link from "next/link";
import { RouteStats } from "../types";
import ProgressBar from "./progress_bar";
import Legend from "./legend";
import { routeName } from "@/utils/constants";

function routeDescription(name: string[]) {
  if (name.length === 1) {
    return (
      <span>
        <strong>{name[0]}</strong>
      </span>
    );
  } else {
    return (
      <>
        <span>
          De <strong>{name[0]}</strong>
        </span>
        <br />
        <span>
          à <strong>{name[1]}</strong>
        </span>
      </>
    );
  }
}

export default function RouteDetails({
  route,
  setHash,
}: {
  route: RouteStats;
  setHash: (hash: string) => void;
}) {
  return (
    <>
      <div className="vif-detail-header vif-detail-header--route">
        <h3
          className="route-code route-code--large"
          style={
            {
              "--route-color": `var(--route-color-${route.code})`,
            } as React.CSSProperties
          }
        >
          {route.code}
        </h3>
        <a
          className="vif-detail--close-button"
          onClick={() => setHash("region")}
        ></a>
      </div>
      <div className="vif-detail-content">
        <div className="vif--block">
          <label className="has-text-weight-normal has-text-grey">
            {routeDescription(routeName[route.code])}
          </label>
        </div>
        <div className="vif--block">
          <ProgressBar stats={route.stats} total={route.total} global={false} />
        </div>
        <div className="vif--block vif-container vif-container--narrow vif-border-top">
          <Legend stats={route.stats} total={route.total} />
        </div>
      </div>
    </>
  );
}
