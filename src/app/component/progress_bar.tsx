import { statusColor, shortStatusLabel } from "@/utils/constants";
import { LengthStats, TronçonStatus } from "../types";

type Props = { stats: LengthStats; total: number; global: Boolean };
const Part = ({
  props,
  statuses,
  pointer,
}: {
  props: Props;
  statuses: TronçonStatus[];
  pointer?: Boolean;
}) => {
  let className = "progress-bar__part";
  const sumStat = statuses
    .map((status) => props.stats[status])
    .reduce((sum, current) => sum + current, 0);
  const width = (100 * sumStat) / props.total;
  const style: { [key: string]: string } = {
    width: `${width}%`,
    flexGrow: `${width}`,
  };
  if (!pointer) {
    if (statuses.length == 1) {
      style["background"] = statusColor[statuses[0]];
    } else {
      style["background"] = statusColor["Background"];
    }
  }
  return (
    <div style={style} className={className}>
      {pointer && Pointer(statuses, props)}
    </div>
  );
};

function Pointer(statuses: TronçonStatus[], props: Props) {
  const text = statuses.map((status) => (
    <div key={status}>
      {shortStatusLabel[status]} :{" "}
      {Math.round((100 * props.stats[status]) / props.total)}%
    </div>
  ));
  return (
    <div className="progress-bar__pointer progress-bar__pointer">
      <div className="progress-bar__arrow progress-bar__arrow--gray"></div>
      <div className="progress-bar__bubble progress-bar__bubble--gray">
        {text}
      </div>
    </div>
  );
}

export default function ProgressBar(props: Props) {
  const part_ok =
    (100 *
      (props.stats[TronçonStatus.PreExisting] +
        props.stats[TronçonStatus.Built] +
        props.stats[TronçonStatus.Building])) /
    props.total;

  const parts = [
    [TronçonStatus.PreExisting],
    [TronçonStatus.Built],
    [TronçonStatus.Building],
    [TronçonStatus.Planned, TronçonStatus.Blocked, TronçonStatus.Unknown],
  ];

  return (
    <>
      <div className="progress-bar">
        <div className="progress-bar__parts">
          {parts.map((statuses) => (
            <Part key={statuses.join()} props={props} statuses={statuses} />
          ))}
        </div>
        <div className="progress-bar__parts-hover">
          {parts.map((statuses) => (
            <Part
              key={statuses.join()}
              props={props}
              statuses={statuses}
              pointer
            />
          ))}
        </div>
        <div className="progress-bar__pointer">
          <div
            className="progress-bar__arrow"
            style={{ marginLeft: `${part_ok}%` }}
          ></div>
          <div
            className="progress-bar__bubble progress-bar__bubble--black"
            style={{ marginLeft: `${part_ok}%` }}
          >
            {Math.round(part_ok)}%
          </div>
        </div>
      </div>
      {props.global && (
        <div className="title is-size-5 has-text-centered">
          État d’avancement de la phase&nbsp;1 du réseau VIF (2025)
        </div>
      )}
    </>
  );
}
