---
name: implement
description: Execute one approved Amarelo spec or unblocked ticket through tests, evidence, review and merge readiness.
disable-model-invocation: true
---

# Implement

Implement only the scope owned by the active prospective spec and its currently unblocked ticket.

## Procedure

1. Load `AGENTS.md`, `.agents/specs/workflow.md`, the complete `.spec.md` contract, applicable rules/context/ADRs and the ticket dependency graph.
2. Start from the required base branch. The first implementation commit changes spec status from `ready` to `in-progress`.
3. Follow `.agents/skills/tdd/SKILL.md` at the predeclared seams: one red behavior, the minimum green implementation, then the next vertical slice.
4. Run focused typechecks/tests throughout. Preserve privacy fixtures, package boundaries, semantic suffixes and the repository lockfile policy.
5. Run the complete repository validation after all slices are green. A failed or pending gate stops execution.
6. Promote only proven durable conclusions to context, rules, ADRs or mechanical checks.
7. Set the spec to `implemented`, replace pending evidence with stable references and check criteria only after they are reproducible.
8. Run `.agents/skills/code-review/SKILL.md` on the exact final head as two independent axes: Standards and Spec fidelity.
9. Any code or document change invalidates prior CI and reviews; repeat them on the new head.
10. Merge only when CI is fully green, the branch is current and conflict-free, both reviews pass, and the PR records the exact reviewed head.

## Completion criterion

Implementation, spec status, evidence, promoted harness state, exact-head CI and both review axes agree. No out-of-scope behavior or unresolved blocking finding remains.
