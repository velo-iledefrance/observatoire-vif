import { statusColor } from "@/utils/constants";
import { LengthStats, TronçonStatus } from "../types";

type Props = { stats: LengthStats; total: number };
const Part = ({
  props,
  status,
}: {
  props: Props;
  status: TronçonStatus;
}) => {
  let className = "progress-bar-part";
  const width = (100 * props.stats[status]) / props.total;
  return (
    <div
      style={{
        width: `${width}%`,
        flexGrow: `${width}`,
        background: statusColor[status],
      }}
      className={className}
    />
  );
};

export default function ProgressBar(props: Props) {
  const part_ok =
    (100 *
      (props.stats[TronçonStatus.PreExisting] +
        props.stats[TronçonStatus.Built] +
        props.stats[TronçonStatus.Building])) /
    props.total;
  return (
    <>
      <div className="progress-bar">
        <div className="progress-bar--parts">
          <Part props={props} status={TronçonStatus.PreExisting} />
          <Part props={props} status={TronçonStatus.Built} />
          <Part props={props} status={TronçonStatus.Building} />
          <Part props={props} status={TronçonStatus.Planned} />
          <Part props={props} status={TronçonStatus.Blocked} />
          <Part props={props} status={TronçonStatus.Unknown} />
        </div>
      </div>
      <div className="progress-bar--pointer">
        <div
          className="progress-bar--arrow"
          style={{ marginLeft: `${part_ok}%` }}
        ></div>
        <div
          className="progress-bar--percent is-size-4 has-text-weight-bold has-text-centered"
          style={{ marginLeft: `${part_ok}%` }}
        >
          {Math.round(part_ok)}%
        </div>
      </div>
    </>
  );
}
