# newnewsletter

[![CI main.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml)
[![CI main3.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml)
[![Dernier commit](https://img.shields.io/github/last-commit/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/commits/main)
[![Issues ouvertes](https://img.shields.io/github/issues/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/issues)
[![Licence](https://img.shields.io/github/license/ThomasBenoitNDP/newnewsletter)](./LICENSE)
[![Documented with Setinstone.io](https://img.shields.io/badge/Documented%20with-Setinstone.io%20⛰️-success?logo=book&logoColor=white)](https://setinstone.io)

## Présentation
newnewsletter est un projet de contrats intelligents pour gérer des abonnements on-chain à une newsletter, en s'appuyant sur le standard ERC‑5643 (abonnements renouvelables/expirables). Le dépôt contient un environnement Hardhat avec les contrats Solidity, les scripts de déploiement et des tests.

Objectifs clés:
- Permettre la création, le renouvellement et l'annulation d'abonnements on-chain.
- Exposer des primitives de consultation (expiration, statut d'un abonnement).
- Faciliter le déploiement et le test via Hardhat.

Statut: en cours de construction. Cette documentation évoluera au fur et à mesure des releases et audits.

## Architecture
- .github/workflows: pipelines d'intégration continue (build, tests, autres jobs).
- hardhat/contracts: base du domaine fonctionnel (IERC5643, ERC5643, newnewsletter, et l'exemple Lock).
- hardhat/scripts: scripts de déploiement des contrats.
- hardhat/test: tests automatisés couvrant les contrats principaux.
- hardhat/hardhat.config.js: configuration Hardhat (version de Solidity, plugins).
- hardhat/package.json: dépendances et scripts Node pour l'environnement Hardhat.

## Prérequis
- Node.js LTS recommandé (exemple: 16 ou 18) et npm.
- Un endpoint RPC EVM pour les réseaux visés (développement local, testnet, mainnet selon les besoins).
- Un compte développeur et une clé privée gérée de manière sécurisée (variables d'environnement locales et secrets chiffrés côté CI).

## Installation
1) Cloner le dépôt.
2) Se placer dans le répertoire hardhat.
3) Installer les dépendances Node listées dans hardhat/package.json.

## Configuration
- Créer un fichier d'environnement local pour définir les éléments nécessaires au déploiement et aux tests, par exemple: URL RPC, clé privée de déploiement, identifiant du réseau.
- Vérifier la version de Solidity indiquée dans hardhat/hardhat.config.js et la compatibilité des dépendances (Hardhat, Ethers, OpenZeppelin).

## Usage
- Compilation: utiliser la commande de compilation Hardhat adaptée à votre environnement.
- Tests: exécuter la suite de tests depuis le répertoire hardhat.
- Déploiement: lancer le script de déploiement correspondant au contrat ciblé, puis consigner l'adresse déployée (par réseau) dans la documentation du projet ou dans les Releases.

## Fonctions et classes principales
| nom | fichier | description | entrées | sorties |
|---|---|---|---|---|
| IERC5643 | hardhat/contracts/IERC5643.sol | Interface du standard ERC‑5643 pour abonnements expirable/renouvelable | Paramètres typiques: identifiant du jeton, adresse titulaire, durée ou timestamp (selon l'implémentation). À confirmer dans le code | Valeurs typiques: timestamp d'expiration, booléens de statut, événements d'abonnement. À confirmer |
| ERC5643 | hardhat/contracts/ERC5643.sol | Implémentation de l'interface ERC‑5643 | Identifiant du jeton, périodes de renouvellement, adresse opérateur (selon contrôles d'accès). À confirmer | Événements de renouvellement/annulation, nouveaux timestamps d'expiration. À confirmer |
| newnewsletter | hardhat/contracts/newnewsletter.sol | Contrat métier gérant les abonnements de la newsletter (s'appuie sur ERC‑5643) | Paramètres attendus: prix de souscription, devise, période, bénéficiaire, identifiant d'abonnement. À confirmer | Identifiant d'abonnement, état actif/inactif, échéance, événements métier. À confirmer |
| Lock | hardhat/contracts/Lock.sol | Contrat d'exemple fourni par Hardhat | Date de déblocage, déposant | État de verrouillage, événements de retrait |

Remarque: les signatures exactes des fonctions et leur comportement doivent être validés en lisant les contrats. Les entrées/sorties ci‑dessus sont des indications à affiner pour garantir la parfaite cohérence avec l'implémentation.

## Tests
- Les tests se trouvent dans hardhat/test. Ils couvrent notamment le comportement de newnewsletter et l'exemple Lock.
- Lancer les tests via l'outil de test Hardhat dans le répertoire hardhat.

## Déploiement
- Des scripts de déploiement sont disponibles dans hardhat/scripts (exemples: deploy.js, deploy_newnewsletter.js).
- Préparer les variables d'environnement nécessaires (endpoint RPC, clé privée, réseau cible), puis exécuter le script approprié.
- Documenter l'adresse déployée et le réseau dans ce README ou dans une Release.

## Dépendances principales
- Hardhat et ses plugins (toolbox, ethers, upgrades d'OpenZeppelin).
- Ethers (v5) pour l'interaction avec les contrats.
- OpenZeppelin Contracts pour des primitives standardisées et sûres.

## Conformité & sécurité (visibles)
- Traçabilité et revue: contributions via Pull Requests, approbations requises et checks CI recommandés sur la branche principale.
- Contrôle d'accès: documenter les fonctions d'administration du contrat (ex. propriétaire ou rôles). Limiter les opérations sensibles aux comptes autorisés.
- Secrets et clés: ne pas committer de clés privées. Utiliser des variables d'environnement locales et les secrets chiffrés GitHub Actions.
- Politique de sécurité: ajouter un fichier SECURITY.md décrivant la procédure de signalement de vulnérabilités, les canaux de contact et les délais de réponse.
- Gestion des dépendances: utiliser le lockfile, activer Dependabot pour les mises à jour et correctifs de sécurité.
- Journalisation: conserver l'historique des changements via PR et Releases. Recommander des conventions de commit et des commits signés.
- Avertissement: les contrats n'ont pas fait l'objet d'un audit de sécurité public au moment de la rédaction. Ne pas utiliser en production sans audit.

## Changelog et versioning
- Suivre SemVer pour les releases et tagger les versions.
- Publier un CHANGELOG ou utiliser la page Releases pour décrire les changements, migrations et adresses de déploiement par réseau.

## Contribution
- Les contributions sont les bienvenues via Pull Requests.
- Recommandé d'ajouter des fichiers CONTRIBUTING.md, CODE_OF_CONDUCT.md et CODEOWNERS pour clarifier le processus et les rôles.

## Support et contact
- Questions, demandes de fonctionnalités et rapports de bugs: ouvrir une Issue sur GitHub.
- Mainteneur principal: voir la page du propriétaire du dépôt sur GitHub.

## Licence
- Aucune licence n'est définie à la racine pour le moment. Il est recommandé d'ajouter un fichier LICENSE (par exemple MIT ou ISC, en cohérence avec hardhat/package.json) pour clarifier les droits d'usage.

## Références
- Standard ERC‑5643 (abonnements): consulter la spécification pour les exigences fonctionnelles et les événements associés.
- OpenZeppelin Contracts et Upgrades: bonnes pratiques de sécurité et d'extensibilité.
