import { GlobalStats, PhasesMap, Level } from "../types";
import ProgressBar from "./progress_bar";
import Legend from "./legend";
import PhaseInfo from "./phase_info";

export default function NetworkInfo({
  globalStats,
  phases,
  level,
  setHash,
}: {
  globalStats: GlobalStats;
  phases: PhasesMap;
  level: Level;
  setHash: (hash: string) => void;
}) {
  return (
    <section className="section vif-network-info">
      <div className="vif-container" onClick={() => setHash("region")}>
        <ProgressBar stats={globalStats.stats} total={globalStats.total} additionalClassName="progress-bar--main progress-bar--interactive" />
        <div className="is-size-5 has-text-centered">
          État d’avancement du réseau VIF
        </div>
      </div>
      <div className="vif-container vif-container--narrow">
        <h1 className="title is-size-3 has-text-centered has-text-weight-bold">
          Observatoire du Réseau Vélo <span>Île-de-France</span>
        </h1>
      </div>
      <div className="vif-container vif-container--narrow vif-border-top">
        <Legend stats={globalStats.stats} total={globalStats.total} />
      </div>
      <div className="vif-container">
        <p className="block has-text-centered">
          <span>
            Le réseau vélo Île-de-France (réseau VIF) comprend 750 km de voies
            cyclables directes, continues et sécurisées pour connecter les
            grands pôles de la&nbsp;région.
          </span>
          <span>
            {" "}
            Le&nbsp;projet est porté par la Région{" "}
            <span style={{ whiteSpace: "nowrap" }}>Île-de-France</span>.
            Cet observatoire rend compte de l’avancement du projet.
          </span>
        </p>
      </div>
      <PhaseInfo phases={phases} level={level} setHash={setHash} />
    </section>
  );
}
