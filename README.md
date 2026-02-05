# Observatoire du réseau Vélo Île-de-France (VIF)

Ce dépôt est le code source du site de l’observatoire du réseau vélo Île-de-France. L’observatoire est proposé et maintenu par le [Collectif Vélo Île-de-France](https://velo-iledefrance.fr). L’association est à l’origine du projet de réseau VIF, initialement appelé RER V. Le site est réalisé par [Codeur·euses en Liberté](https://codeureusesenliberte.fr).

Les données affichées sont mises à la disposition du public par la région Île-de-France et régulièrement mises à jour. [cocarto](https://cocarto.com), développé par Codeur·euses en Liberté, permet d’ajouter aux données de la région des observations du collectif.

## Environnement technique

L’observatoire est un site statique, réalisé avec [next.js](https://nextjs.org/). [Node](https://nodejs.org/en/download/package-manager) et [`bun`](https://bun.com/docs/installation) sont requis.

- Outre la génération du html, le projet récupère les données depuis cocarto et prépare le contenu à afficher pour chaque segment. Notamment, les données des communes sont rajoutées à partir de `./data/communes-ile-de-france.geo.json`.
- La carte est réalisée avec maplibre, et utilise un fond de carte préparé sur maptiler.com et dont les données sont fournies par [Tuiles en Liberté](https://tuiles.enliberte.fr).

Cette variable d’environnement est nécessaire:

```
COCARTO_TOKEN= # token de partage de la carte sur cocarto
```

### Développement

Installer les dépendances:

```
make install
```

Démarrer un serveur local:

```
make run
```

### Publication

```
make build
```

génère un site statique dans le dossier `./out`.
