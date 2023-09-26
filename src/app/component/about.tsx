import Link from "next/link";

export default function About() {
  return (
    <section className="section">
      <div className="vif-container vif-container--about">
        <h2 className="title is-size-4 has-text-centered">À propos</h2>
        <p className="block has-text-centered">
          Cet observatoire est proposé et maintenu par le{" "}
          <Link href="https://velo-iledefrance.fr/">
            Collectif Vélo{" "}
            <span style={{ whiteSpace: "nowrap" }}>Île-de-France</span>
          </Link>
          . L’association est à l’origine du projet de réseau VIF, initialement
          appelé&nbsp;RER&nbsp;V.
        </p>

        <p className="block has-text-centered">
          Les données affichées sont mises à la disposition du public par la
          région <span style={{ whiteSpace: "nowrap" }}>Île-de-France</span> et
          régulièrement mises à&nbsp;jour.
        </p>

        <p className="block has-text-centered">
          Réalisé par{" "}
          <Link href="https://codeursenliberte.fr/">Codeurs en Liberté</Link> et
          construit&nbsp;avec{" "}
          <Link href="https://cocarto.com">cocarto.com</Link>.
        </p>
      </div>
    </section>
  );
}
