import { GlobalStats } from "../types";
import ProgressBar from "./progress_bar";
import Legend from "./legend";

export default function GlobalStats({
  globalStats,
}: {
  globalStats: GlobalStats;
}) {
  return (
    <section className="section vif-global-stats">
      <div className="vif-container">
        <ProgressBar
          stats={globalStats.stats}
          total={globalStats.total}
          global={true}
        />
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
            <span style={{ whiteSpace: "nowrap" }}>Île-de-France</span>. Une
            première moitié doit être déployée d’ici 2025, l’autre d’ici 2030.
            Cet observatoire rend compte de l’avancement du projet.
          </span>
        </p>
      </div>
    </section>
  );
}
