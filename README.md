[![Documented with Setinstone.io](https://img.shields.io/badge/⛰️Documented%20with-Setinstone.io-success?logo=book&logoColor=white)](https://setinstone.io)

# newnewsletter

Smart contracts for on-chain newsletter subscriptions aligned with ERC‑5643 (renewable and expirable subscriptions), packaged with a Hardhat workspace for development, testing, and deployment. Status: work in progress; not audited.

[![CI main.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml)
[![CI main2.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main2.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main2.yml)
[![CI main3.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml)
[![Last commit](https://img.shields.io/github/last-commit/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/commits/main)
[![Open issues](https://img.shields.io/github/issues/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/issues)
[![License](https://img.shields.io/github/license/ThomasBenoitNDP/newnewsletter)](./LICENSE)

## Overview
newnewsletter provides building blocks to create, renew, and cancel on-chain newsletter subscriptions according to ERC‑5643. It includes a Hardhat workspace with contracts, tests, and deployment scripts for EVM-compatible networks. Documentation will evolve alongside releases and any future audits.

### Key goals
- Manage subscription lifecycles on-chain: creation, renewal, and cancellation.
- Provide visibility into subscription status and expiration.
- Streamline local development, testing, and deployment with Hardhat.

## Architecture and repository structure
- .github/workflows: CI pipelines for build and tests.
- hardhat/contracts: core Solidity contracts (IERC5643, ERC5643, newnewsletter, Lock sample).
- hardhat/scripts: deployment scripts for contracts.
- hardhat/test: automated tests for core contracts.
- hardhat/hardhat.config.js: Hardhat configuration.
- hardhat/package.json: Node dependencies and scripts for the Hardhat workspace.

## Getting started
### Prerequisites
- Node.js LTS and npm.
- An EVM RPC endpoint for your target network (local, testnet, or mainnet).
- A developer account and private key stored securely via environment variables locally and encrypted secrets in CI.

### Installation
- Clone the repository.
- Navigate into the hardhat workspace directory.
- Install the Node dependencies listed in the workspace package manifest.

### Configuration
- Create a local environment file for RPC endpoint, private key, and target network identifiers.
- Review the Solidity version in the Hardhat configuration and ensure compatibility with dependencies (Hardhat, Ethers, OpenZeppelin).
- For CI, store secrets in GitHub Actions encrypted secrets. Never commit private keys or seed phrases.

## Usage
- Compile the contracts using the Hardhat toolchain.
- Run the automated tests in the workspace.
- Deploy using the provided deployment scripts to your chosen network, then record deployed addresses per network.

## Testing
- The test suite resides under hardhat/test and covers the newnewsletter contract and a Lock sample.
- Ensure your environment is configured before running the test runner.

## Deployment
- Deployment scripts are located under hardhat/scripts.
- Prepare required environment variables (RPC endpoint, deployer key, network).
- After deployment, document the contract address, target network, and whether the contract has been verified on the relevant explorer.

## Contracts overview
| name | file | description | inputs | outputs |
|---|---|---|---|---|
| IERC5643 | hardhat/contracts/IERC5643.sol | Interface for renewable and expirable subscriptions per ERC‑5643 | Typical: subscriber address or token/subscription identifier; renewal period or expiration timestamp (as applicable) | Typical: expiration timestamp, status flags, and subscription events |
| ERC5643 | hardhat/contracts/ERC5643.sol | Reference implementation of the ERC‑5643 interface | Common: identifier, renewal configuration, caller permissions for renewal/cancellation | Emits renewal/cancellation events; updates and exposes expiration values |
| newnewsletter | hardhat/contracts/newnewsletter.sol | Newsletter-specific logic using ERC‑5643 primitives | Likely: subscription price, currency, renewal period, treasury/beneficiary, subscriber identifier; admin controls for parameters | Subscription state (active, expiration), and domain events for subscribe, renew, cancel |
| Lock | hardhat/contracts/Lock.sol | Example contract included by Hardhat (unrelated to subscriptions) | Lock parameters such as unlock date and depositor | Lock state and withdrawal-related events |

Notes: Validate exact function signatures and events in source before integration. Inputs and outputs above reflect common ERC‑5643 patterns.

## Networks and deployed addresses
- Please add a simple table of network name, chain ID, contract address, and verification status after each deployment.

## Dependencies
Primary workspace dependencies for transparency and supply-chain review:
- @nomicfoundation/hardhat-toolbox (dev)
- @nomiclabs/hardhat-ethers (dev)
- @openzeppelin/hardhat-upgrades (dev)
- hardhat (dev)
- ethers
- @openzeppelin/contracts
- openzeppelin-solidity

Consider generating and publishing a Software Bill of Materials (SBOM) with each release for enhanced supply-chain transparency.

## Versioning and changelog
- Recommend Semantic Versioning for contract and repository version tags.
- Maintain a CHANGELOG.md capturing features, fixes, and breaking changes per release.
- Use GitHub Releases to publish artifacts (addresses, SBOM, checksums) and link them here.

## Security and compliance (visible controls)
- Reviews and traceability: changes via Pull Requests, with CI checks required before merging to main.
- Access control: document administrative functions and restrict sensitive operations to authorized accounts (e.g., owner or role-based controls). Clearly define roles and privileges.
- Secrets management: never commit private keys. Use environment variables locally and encrypted GitHub Actions secrets in CI.
- Dependency hygiene: maintain an inventory of dependencies, update regularly, and address vulnerabilities promptly. Consider enabling Dependabot alerts and updates.
- Audit readiness: maintain deployment records (network, block number, contract address, verification links). Capture test evidence in CI artifacts.

Alignments and recommendations
- SOC 2: enforce branch protections and mandatory reviews; retain CI logs; document change management in PRs; restrict deployer credentials and monitor usage.
- ISO 27001: define roles and responsibilities; maintain a risk register for contract changes; plan for business continuity of keys, RPC endpoints, and deployment metadata; keep supplier/dependency inventory current.
- NIST 2: document incident reporting and communications; define response SLAs; perform post-incident reviews and link outcomes to issues and releases.

## Security policy and responsible disclosure
- Add SECURITY.md with contact details, supported versions, and disclosure process. Until then, please open a private security advisory using GitHub's security advisories and avoid sharing sensitive details in public issues.

## Contributing and governance
- Add CONTRIBUTING.md with development conventions, branch strategy, commit messages, and review requirements.
- Add CODE_OF_CONDUCT.md to set community expectations.

## Maintainers and contact
- Primary maintainer: ThomasBenoitNDP (GitHub).
- Contributors: see the GitHub contributors graph. Thank you to all contributors.

## License
- License file is referenced via badge. If not yet present, add a LICENSE file (e.g., MIT or Apache‑2.0) and confirm repository metadata.

## Acknowledgements
- ERC‑5643 authors and the OpenZeppelin and Hardhat communities.

## ⛰️ Documented With SetinStone.io
 Focus on the only task that matters: building your codebase! With every developer push, Set In Stone's Mirror Documentation Agent updates your README.md via a pull request — ready for you to review, edit, and approve.

Book a demo :  https://setinstone.io 
