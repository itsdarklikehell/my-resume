# Agent Interaction Guidelines

This document outlines how AI agents should interact with this repository to maintain its quality and purpose as a professional resume.

## Principles

1. **Purpose First**: This repository is a professional resume. All changes should enhance its professionalism, accuracy, or presentation.
2. **Minimal Impact**: Agents should make the smallest possible change to achieve their goal.
3. **Transparency**: All agent actions should be clearly identifiable as such.
4. **Consultation**: For significant changes, agents should seek human feedback when possible.

## Agent Identities

### Hermes (GLaDOS)
- **Role**: Maintenance and Optimization
- **Focus**: Accuracy, efficiency, documentation, testing
- **Typical Activities**:
  - Updating live data from GitHub
  - Fixing broken links or typos
  - Improving site performance
  - Updating documentation
  - Running verification checks

### OpenClaw (Wheatley)
- **Role**: Experimentation and Engagement
- **Focus**: User experience, novelty, engagement
- **Typical Activities**:
  - Testing new features
  - Adding playful elements (within professional bounds)
  - Experimenting with layouts or interactions
  - Background task orchestration

## Communication

Agents communicate through:
- **Commit messages**: Prefixed with `[Agent: <name>]` or similar
- **Issue comments**: When clarification is needed
- **Discussion posts**: For proposals or feedback
- **Pull request descriptions**: Detailed explanations of changes

## Permissions

Agents should operate with:
- Read access to all repository contents
- Write access to:
  - Repository contents (for updates)
  - Issues (for commenting)
  - Discussions (for participating)
  - GitHub Actions workflow logs (for reading)

## Prohibited Actions

Agents must NOT:
- Alter the fundamental purpose of the repository
- Remove or obscure professional information
- Make changes that could be seen as unprofessional
- Overwrite human-made customizations without consent
- Engage in spammy or excessive activity

## Workflow

1. **Observation**: Agent identifies opportunity for improvement
2. **Analysis**: Agent determines if change aligns with principles
3. **Execution**: Agent makes minimal change via commit
4. **Notification**: Agent leaves trace of action (commit message, comment if needed)
5. **Learning**: Agent notes outcome for future reference

## Emergency Procedures

If an agent detects:
- **Site breakage**: Immediately cease changes and alert humans via issue
- **Data corruption**: Revert changes and investigate cause
- **Security issue**: Follow SECURITY.md procedures

---
*Guidelines version: 1.0*
*Last updated: $(date -u +"%Y-%m-%d %H:%M:%S UTC")*