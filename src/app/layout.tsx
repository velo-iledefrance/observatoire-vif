import "./globals.scss";
import { Source_Sans_3 } from "next/font/google";
import StateHolder from "./component/state_holder";
import { prepareData } from "@/utils/prepared_data";

const inter = Source_Sans_3({ subsets: ["latin"] });

export const metadata = {
  title: "Observatoire Vélo Île-de-France",
  description: "Suivi de l’avancée du plan vélo de la région Île-de-France",
};

export default async function RootLayout() {
  const data = await prepareData();

  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://unpkg.com/maplibre-gl@3.0.0/dist/maplibre-gl.css"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="/cropped-favicon_cvidf_rvb-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/cropped-favicon_cvidf_rvb-192x192.png"
          sizes="192x192"
        />
        <link
          rel="apple-touch-icon"
          href="/cropped-favicon_cvidf_rvb-180x180.png"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://compteurs.enliberte.fr/hit/i9wdpg585ozy2rq"
        />

        <title>Observatoire du Réseau Vélo Île-de-France</title>
        <meta
          name="title"
          content="Observatoire du Réseau Vélo Île-de-France"
        />
        <meta
          name="description"
          content="Le réseau vélo Île-de-France (réseau VIF) comprend 750 km de voies cyclables directes, continues et sécurisées pour connecter les grands pôles de la région. Le projet est porté par la Région Île-de-France. Cet observatoire rend compte de l’avancement du projet.
        "
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://observatoire-vif.velo-iledefrance.fr"
        />
        <meta
          property="og:title"
          content="Observatoire du Réseau Vélo Île-de-France"
        />
        <meta
          property="og:description"
          content="Le réseau vélo Île-de-France (réseau VIF) comprend 750 km de voies cyclables directes, continues et sécurisées pour connecter les grands pôles de la région. Le projet est porté par la Région Île-de-France. Cet observatoire rend compte de l’avancement du projet.
        "
        />
        <meta property="og:image" content="/preview.webp" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://observatoire-vif.velo-iledefrance.fr"
        />
        <meta
          property="twitter:title"
          content="Observatoire du Réseau Vélo Île-de-France"
        />
        <meta
          property="twitter:description"
          content="Le réseau vélo Île-de-France (réseau VIF) comprend 750 km de voies cyclables directes, continues et sécurisées pour connecter les grands pôles de la région. Le projet est porté par la Région Île-de-France. Cet observatoire rend compte de l’avancement du projet.
        "
        />
        <meta property="twitter:image" content="/preview.webp" />
      </head>
      <body className={inter.className}>
        <main className="vif-main">
          <StateHolder data={data} />
        </main>
      </body>
    </html>
  );
}
