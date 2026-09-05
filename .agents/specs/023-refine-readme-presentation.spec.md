# SPEC-023: Refine README presentation without changing content

- Status: Proposed
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Orbz maintainers
- Approval: the current owner request authorizes this presentation-only scope,
  harness updates, validation/conflict repair and conditional PR merge.

## Problem

The README has centered branding but vertically stacked resource links and a
flat reference hierarchy. The owner requested a more polished GitHub layout with
every existing word, code example and destination preserved.

## Scope

Change `README.md`, this spec, the spec catalog, the existing review workflow and
the existing documentation audit. Preserve current upstream content as feature
deliveries integrate. Product source, dependencies, assets, version, release and
deployment configuration are outside this formatting change.

The initial integration base is
`589cf510e54e4ca526575a165b92e62560f3b2f3`. If staging advances, retain its content
before applying the same presentation changes and record the final comparison
base below. The earlier presentation attempt in PR #9 used SPEC-022 before a
concurrent content-documentation delivery allocated that ID. This separate
SPEC-023 removes that collision; it does not rewrite the other delivery.

## Requirements

1. Preserve visible words and punctuation, ordered heading labels and section
   order, native heading anchors, inline/fenced code, table cells, links and
   image sources/alternative text. Existing copy issues remain outside scope.
2. Center and emphasize the four existing resource links in their original order
   using supported HTML and whitespace, with no new visible navigation copy.
3. Give subordinate appearance, package-entry and Git-quality sections appropriate
   heading levels, and add restrained spacing before major sections. Keep all
   instructions visible without collapsible containers.
4. Extend the existing POSIX documentation audit to validate centered resources
   and exact heading levels while retaining its other checks. Add formatting-only
   content-preservation guidance to the existing review workflow.
5. Compare rendered GFM semantics to the final base, normalizing presentation
   whitespace only. Compare code content and languages without normalization.
6. Run `./cli/orb check`, inspect the npm payload, and obtain independent review.
   Merge only after final-head GitHub checks, any applicable deployment status
   and conflict checks pass. Do not bypass a gate or publish a package.

## Acceptance criteria

- [ ] Existing resource links are centered and emphasized without copy changes.
- [ ] Heading hierarchy and section spacing improve scanning without changing
      labels, section order or native anchors.
- [ ] Rendered visible text, code, links, images and table cells equal the final
      upstream baseline under the comparison rules above.
- [ ] Documentation audit passes and rejects missing/reordered resources,
      changed destinations and wrong heading levels; the untouched baseline fails.
- [ ] The spec catalog and review workflow describe this bounded delivery.
- [ ] Full Orb validation, npm payload inspection and independent review pass;
      final-head remote gates are recorded in the PR before merge.

## Evidence

- Pending final integration base, semantic comparison counts, negative probes,
  full Orb gate, npm package inspection and independent review.
- PR #9 remains historical evidence for the earlier formatting attempt; its
  results do not authorize merging a different head.

## Related records

- [SPEC-011](./011-add-readme-banner-and-tooling-guide.spec.md): retained assets.
- [SPEC-014](./014-consolidate-orb-commands-and-add-npx-setup.spec.md): installer contract.
- [Rule 007](../rules/007-harness-documentation-and-audits.rule.md): documentation.
- [Rule 004](../rules/004-web-component-accessibility-and-localization.rule.md): accessibility.
- [Rule 005](../rules/005-voice-and-speech.rule.md): speech documentation.
- [Rule 012](../rules/012-agent-runtime-guardrails.rule.md): authorized merge boundary.
- No new ADR: architecture and public APIs remain unchanged.

## Compatibility and risks

The principal risks are accidental copy/command/URL changes, unreadable HTML,
and overwriting concurrent README additions. Preserve upstream first, retain
native Markdown headings, and compare rendered semantics before merge. No
runtime, SSR, speech, localization or package-version behavior changes. Revert
the presentation and corresponding audit expectations to roll back this work.
