[![Documented with Setinstone.io](https://img.shields.io/badge/⛰️Documented%20with-Setinstone.io-success?logo=book&logoColor=white)](https://setinstone.io)

# newnewsletter

Smart contracts for on-chain newsletter subscriptions aligned with ERC-5643 (renewable and expirable subscriptions), packaged with a Hardhat workspace for development, testing, and deployment.

[![CI main.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main.yml)
[![CI main2.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main2.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main2.yml)
[![CI main3.yml](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml/badge.svg?branch=main)](https://github.com/ThomasBenoitNDP/newnewsletter/actions/workflows/main3.yml)
[![Last commit](https://img.shields.io/github/last-commit/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/commits/main)
[![Open issues](https://img.shields.io/github/issues/ThomasBenoitNDP/newnewsletter)](https://github.com/ThomasBenoitNDP/newnewsletter/issues)
[![License](https://img.shields.io/github/license/ThomasBenoitNDP/newnewsletter)](./LICENSE)

## Overview
newnewsletter is a Solidity-based project to create, renew, and cancel on-chain newsletter subscriptions. It exposes primitives to query subscription state and expiration, and includes Hardhat scripts and tests for local development and deployment to EVM networks.

Status: work in progress. Documentation will evolve alongside releases and audits.

### Key goals
- Manage subscription lifecycles on-chain: creation, renewal, cancellation.
- Provide visibility into subscription state and expiration.
- Streamline local development, testing, and deployment with Hardhat.

## Repository structure
- .github/workflows: CI pipelines for build and tests.
- hardhat/contracts: core domain (IERC5643, ERC5643, newnewsletter, and a sample Lock contract).
- hardhat/scripts: deployment scripts for contracts.
- hardhat/test: automated tests for key contracts.
- hardhat/hardhat.config.js: Hardhat configuration.
- hardhat/package.json: Node dependencies and scripts for the Hardhat workspace.

## Prerequisites
- Node.js LTS (for example 18) and npm.
- An EVM RPC endpoint for targeted networks (local dev, testnet, or mainnet).
- A developer account and a private key stored securely using local environment variables and encrypted CI secrets.

## Installation
1. Clone the repository.
2. Navigate to the hardhat subfolder.
3. Install the Node dependencies defined in hardhat/package.json.

## Configuration
- Create a local environment file that defines RPC endpoint, deployment key, and target network identifiers.
- Review the Solidity version in hardhat/hardhat.config.js and ensure dependency compatibility (Hardhat, Ethers, OpenZeppelin).
- For CI, store secrets in GitHub Actions encrypted secrets and never commit private keys.

## Usage
- Build and compile the contracts with Hardhat using the appropriate task.
- Run the test suite from the hardhat folder.
- Deploy using the available deployment scripts, then record deployed addresses per network in this README or in a Release.

## Testing
- Tests reside in hardhat/test and cover newnewsletter and the Lock sample.
- Run the tests via the Hardhat test runner in the hardhat folder.

## Deployment
- Deployment scripts are available in hardhat/scripts (for example deploy.js and deploy_newnewsletter.js).
- Prepare the required environment variables (RPC endpoint, private key, target network) before running a deployment.
- After deploying, document the contract address, network, and verification status.

## Contract overview
| name | file | description | inputs | outputs |
|---|---|---|---|---|
| IERC5643 | hardhat/contracts/IERC5643.sol | Interface for renewable/expirable subscriptions per ERC-5643 | Typical: token or subscription identifier, subscriber address, renewal period or expiration timestamp (implementation dependent) | Typical: expiration timestamp, status booleans, subscription-related events |
| ERC5643 | hardhat/contracts/ERC5643.sol | Reference implementation of the ERC-5643 interface | Usually: identifier, renewal period configuration, authorized operator or owner for administrative actions | Emits events for renewal and cancellation; updates and returns new expiration values |
| newnewsletter | hardhat/contracts/newnewsletter.sol | Business contract for newsletter subscriptions built atop ERC-5643 primitives | Likely: price, currency, renewal period, beneficiary/treasury, subscriber identifier; admin controls for parameters | Subscription identifier, active status, expiration, and domain events for subscribe, renew, cancel |
| Lock | hardhat/contracts/Lock.sol | Hardhat sample contract (unrelated to subscriptions) | Lock parameters such as unlock date and depositor | Lock state and withdrawal events |

Notes: The exact function signatures and behaviors should be verified in the source. The inputs and outputs listed above reflect typical ERC-5643 patterns and may require adjustment to match the implementation.

## Security and compliance (visible controls)
- Reviews and traceability: all changes via Pull Requests with mandatory CI checks before merging to main.
- Access control: document administrative functions and restrict sensitive operations to authorized accounts (for example, owner or role-based access). Consider documenting roles and privileges explicitly.
- Secrets management: never commit private keys; use environment variables locally and encrypted GitHub Actions secrets in CI.
- Dependency hygiene: maintain an inventory of dependencies and a regular update cadence; address vulnerabilities promptly.
- Policy artifacts: add a SECURITY.md for reporting vulnerabilities and a responsible disclosure process; add CONTRIBUTING.md, CODE_OF_CONDUCT.md, CODEOWNERS, and CHANGELOG.md.

## Versioning and release management
- Adopt Semantic Versioning for contracts and tooling.
- Tag releases and publish release notes summarizing changes, known issues, and upgrade considerations.
- Track deployed addresses per network and link them in Releases.

## Support and contact
- Open an Issue for bugs or feature requests.
- For security concerns, follow the instructions in SECURITY.md once added.
- Maintainer: ThomasBenoitNDP on GitHub.

## Contributing
- Contributions are welcome. Please open an Issue to discuss significant changes before submitting a Pull Request.
- Use descriptive PR titles and ensure CI passes. Include tests when possible for new or changed behaviors.

## License
License file status: to be confirmed. If no LICENSE file exists, please add one (for example, MIT) and update this section accordingly.

## Acknowledgements
- Built with Hardhat, Ethers, and OpenZeppelin Contracts.
- Implements concepts from the ERC-5643 renewable/expirable subscription standard.

##⛰️ Documented With SetinStone.io
 Focus on the only task that matters: building your codebase!With every developer push, Set In Stone's Mirror Documentation Agent updates your README.md via a pull request — ready for you to review, edit, and approve.

Book a demo :  https://setinstone.io 
