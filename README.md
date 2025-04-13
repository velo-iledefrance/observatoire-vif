# Observatoire du réseau Vélo Île-de-France (VIF)

Ce dépôt est le code source du site de l’observatoire du réseau vélo Île-de-France. L’observatoire est proposé et maintenu par le [Collectif Vélo Île-de-France](https://velo-iledefrance.fr). L’association est à l’origine du projet de réseau VIF, initialement appelé RER V. Le projet est réalisé par [Codeurs en Liberté](https://codeursenliberte.fr).

Les données affichées sont mises à la disposition du public par la région Île-de-France et régulièrement mises à jour. [cocarto](https://cocarto.com), développé par Codeurs en Liberté, permet d’ajouter aux données de la région des observations du collectif.

## Environnement technique

L’observatoire est un site statique, réalisé avec [next.js](https://nextjs.org/). [Node](https://nodejs.org/en/download/package-manager) et [`yarn`](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) sont requis.

- Outre la génération du html, le projet récupère les données depuis cocarto et prépare le contenu à afficher pour chaque segment. Notamment, les données des communes sont rajoutées à partir de `./data/communes-ile-de-france.geo.json`.
- La carte est réalisée avec maplibre, et utilise un fond de carte préparé sur maptiler.com et dont les données sont fournies par [Tuiles en Liberté](https://tuiles.enliberte.fr).

Ces deux variables d’environnement sont nécessaires:

```
COCARTO_TOKEN= # token de partage de la carte sur cocarto
```

### Développement

Installer les dépendances:

```
yarn install
```

Démarrer un serveur local:

```
yarn dev
```

### Publication

```
yarn build
```

génère un site statique dans le dossier `./out`.

##
