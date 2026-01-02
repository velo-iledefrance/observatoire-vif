import { TronçonStatus, LengthStats } from "../types";
import {
  statusColor,
  borderStatusColor,
  statusLabel,
  statusTooltip,
} from "@/utils/constants";

function LegendItem({
  stats,
  total,
  status,
}: {
  stats: LengthStats;
  total: number;
  status: TronçonStatus;
}) {
  const style = {
    background: statusColor[status],
    border: "none",
    outline: `solid 1px ${borderStatusColor[status]}`,
  };
  if (status === TronçonStatus.Planned || status === TronçonStatus.Blocked) {
    style.border = "solid 1px white";
  }
  return (
    <div className="legend__item">
      <span className="legend__item-value">
        {Math.round((100 * stats[status]) / total) + "%"}
      </span>
      <span style={style} className="legend__item-color" />
      <span>{statusLabel[status]}</span>
      <LegendTooltip text={statusTooltip[status]} />
    </div>
  );
}

function VariantLegenditem() {
  const style = {
    background:
      "repeating-linear-gradient(90deg, #BAB7B3, #BAB7B3 3px, white 3px, white 6px)",
    border: "solid .5px white",
    outline: "solid 1px #7f7f7f",
  };

  return (
    <div className="legend__item">
      <span className="legend__item-value"></span>
      <span style={style} className="legend__item-color" />
      <span>{statusLabel["variant"]}</span>
      <LegendTooltip text={statusTooltip["variant"]} />
    </div>
  );
}

function LegendTooltip({ text }: { text: String }) {
  if (text === undefined || text === "") {
    return <></>;
  }
  return (
    <div className="legend__tooltip">
      <div className="legend__tooltip-arrow"></div>
      <div className="legend__tooltip-bubble">{text}</div>
    </div>
  );
}

export default function Legend({
  stats,
  total,
}: {
  stats: LengthStats;
  total: number;
}) {
  return (
    <>
      <div className="legend__group">
        <LegendItem
          stats={stats}
          total={total}
          status={TronçonStatus.PreExisting}
        />
        <LegendItem stats={stats} total={total} status={TronçonStatus.Built} />
        <LegendItem
          stats={stats}
          total={total}
          status={TronçonStatus.Building}
        />
        <LegendItem
          stats={stats}
          total={total}
          status={TronçonStatus.Planned}
        />
        <LegendItem
          stats={stats}
          total={total}
          status={TronçonStatus.Blocked}
        />
        <LegendItem
          stats={stats}
          total={total}
          status={TronçonStatus.Unknown}
        />
      </div>
      <div className="legend__group">
        <VariantLegenditem />
      </div>
    </>
  );
}
