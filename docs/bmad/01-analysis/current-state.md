# True Valence Mapper - Current State

## Existing Components
- **Parent Repository**: `true-valence-mapper` acts as a coordinator for multiple editions.
- **Editions**:
    - `claude`: Reference implementation (Active).
    - `codex`: Engineering workflow optimization (In Development).
    - `bmad`: Requirements modeling & validation (Setup Complete).
    - `spec-kit`, `magic-path`, `openspec`: Other tool integrations.
- **Shared Assets**: `shared/` directory contains styles, components, schemas, and security modules.
- **Governance**: Weekly syncs, feature promotion workflows, and decision logs.

## Integration Points
- **BMAD Edition Role**: To provide requirements modeling and validation for the ecosystem.
- **Validation**: BMAD patterns can be applied to validate relationship data integrity and valence calculations.
- **Workflow**: The BMAD edition will likely consume shared components and contribute back validation logic.
- **Documentation**: BMAD's specification patterns can enhance the existing documentation framework.

## Technical Context
- **Stack**: Node.js, npm.
- **Dependencies**: `bmad-method@alpha` is installed.
- **Structure**: The `versions/bmad` directory is a submodule within the parent repo.
