---
name: code-review
description: Review an Amarelo branch or PR against a fixed merge base on independent Standards and Spec-fidelity axes.
---

# Code Review

Review the exact final diff without allowing code quality to mask incorrect scope or spec fidelity to mask repository violations.

## 1. Pin the comparison

Record the merge-base SHA, reviewed head SHA, commit list and three-dot diff. Fail early when the ref is invalid, the diff is empty or the head changes during review.

## 2. Load sources

For **Standards**, load `AGENTS.md`, applicable `.agents/rules/*.rule.md`, scoped context, accepted ADRs and public package boundaries.

For **Spec fidelity**, load the complete originating `.spec.md`, linked tickets and acceptance evidence. When Memory Nucleus gates apply, use the designated canonical source and compare the implementation without assuming a proposal is already code.

## 3. Review independently

### Standards

Report documented-rule violations, unsafe dependency direction, broken suffix/reference contracts, privacy or authorization regressions, unbounded complexity, duplicated ownership and misleading evidence. Distinguish hard violations from maintainability judgments.

### Spec fidelity

Report missing or partial requirements, incorrect behavior, unsupported checked criteria, scope creep and failure paths that contradict the contract. Each finding cites the relevant spec requirement and affected file or seam.

Run the axes independently and preserve both results in the PR. One pass cannot compensate for the other.

## 4. Revalidate

Resolve every blocking finding. Any resulting head change invalidates both reviews and prior CI; rerun the full sequence. Review comments, PR body and evidence must name the exact final head.

## Result format

```markdown
## Standards

Reviewed head: `<sha>`
Result: PASS | FAIL
Findings: ...

## Spec fidelity

Reviewed head: `<sha>`
Result: PASS | FAIL
Findings: ...
```

## Completion criterion

Both axes report PASS with zero unresolved blocking findings on the same head that has fully green CI and remains current and conflict-free with its base.
