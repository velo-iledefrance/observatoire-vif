import { statusColor, statusLabel, moaLabel, moaName } from "@/utils/constants";
import _ from "lodash";
import { TronçonProperties } from "../types";

function moa(segment: TronçonProperties) {
  if (segment.moa) {
    const moa = moaName[segment.moa] || segment.moa;
    return (
      <div className="vif--block">
        <label className="has-text-weight-normal has-text-grey">
          Collectivité en charge de l’aménagement
        </label>
        <p className="is-size-5 has-text-weight-semibold">{moa}</p>
      </div>
    );
  } else {
    return null;
  }
}

function blockingCommune(segment: TronçonProperties) {
  if (segment.blockingCommune) {
    return (
      <div className="vif--block">
        <label className="has-text-weight-normal has-text-grey">
          Collectivité responsable du blocage
        </label>
        <p className="is-size-5 has-text-weight-semibold">
          {segment.blockingCommune}
        </p>
      </div>
    );
  } else {
    return null;
  }
}

function RouteLogo(code: string) {
  return <h3
  className="route-code route-code--small"
  style={
    {
      "--route-color": `var(--route-color-${code})`,
    } as React.CSSProperties
  }
>
  {code}
</h3>
}

export default function ({
  segment,
  setHash,
}: {
  segment: TronçonProperties;
  setHash: (hash: string) => void;
}) {
  const intCode = (code: string) => parseInt(code.replace('V', ''))
  return (
    <>
      <div className="vif-detail-header vif-detail-header--segment">
        {_(segment.route).sort((a, b) => intCode(a) - intCode(b)).uniq().map(RouteLogo).value()}
        <h3 className="is-size-4">{segment.commune}</h3>
        <a
          className="vif-detail--close-button"
          onClick={() => setHash("region")}
        ></a>
      </div>

      <div className="vif-detail-content">
        <div className="vif--block">
          <label className="has-text-weight-normal has-text-grey">
            Avancement
          </label>
          <p className="is-size-4 has-text-weight-semibold">
            {statusLabel[segment.status]}
          </p>
          <div
            className="segment--status-ruler"
            style={{ background: statusColor[segment.status] }}
          ></div>
        </div>

        {moa(segment)}
        {blockingCommune(segment)}
      </div>
    </>
  );
}
