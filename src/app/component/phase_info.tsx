import { Level, PhaseStats, PhasesMap } from "../types";
import ProgressBar from "./progress_bar";
import Legend from "./legend";
import { phaseName } from "@/utils/constants";
import _ from "lodash";

export default function PhaseInfo({
  phases,
  level,
  setHash,
}: {
  phases: PhasesMap;
  level: Level;
  setHash: (hash: string) => void;
}) {
  return (
    <section className="section vif-phases-stats" onClick={() => setHash("region")}>
      <div className="vif-container">
        {
          _(phases).map((stats, phase) => (
            <button key={phase} 
              className="vif-phase" 
              onClick={(e) => { e.stopPropagation(); setHash(`phase/${phase}`)} }
              aria-pressed={
                level.level === "phase" && level.props.phase === phase
              }
            >
              <div className="is-size-6">
                {phaseName[phase]}
              </div>
              <ProgressBar
                stats={stats.stats}
                total={stats.total}
                global={false}
              />
            </button>
          )).value()
        }
      </div>
    </section>
  );
}
