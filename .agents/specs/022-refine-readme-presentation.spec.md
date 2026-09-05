# SPEC-022: Refine README presentation without changing content

- Status: Implemented
- Created: 2026-09-05
- Updated: 2026-09-05
- Mode: Prospective
- Owner: Orbz maintainers
- Approval: the current owner request explicitly authorizes this bounded contract
  and its implementation through conditional PR merge.

## Problem

The README already has centered branding, but its resource links remain a vertical
bullet list and several related reference sections have the same heading weight
as primary sections. The owner requested a clearer GitHub presentation while
explicitly preserving all existing content and text.

## Scope

Refine `README.md` presentation, record this contract in the spec catalog, and
update the existing documentation audit and review workflow for formatting-only
changes. Existing assets, package source, examples, dependency versions, public
APIs, workflows for CI/deployment, and release metadata remain unchanged.

SPEC-016 through SPEC-021 are already allocated on independent open delivery
branches. This spec starts from staging commit
`25280faac6ba9932559f97e06ed72e8101a9806f` and does not implement those deliveries.

## Requirements

1. Preserve every prose word, punctuation mark, heading label, inline code span,
   code-block language and contents, table value, link label/destination, image
   source and alternative text. Existing copy issues are outside this scope.
2. Preserve section order and native heading anchors. Use ordinary GitHub
   Markdown and supported HTML presentation only; add no stylesheet or script.
3. Center the four existing resource links as one responsive group with their
   original labels, destinations and order. Spacing must not add visible copy.
4. Clarify hierarchy for subordinate appearance, entry-point and contribution
   sections, and introduce restrained spacing at major transitions. Keep prose,
   examples and reference tables readable without collapsed containers.
5. Extend the existing POSIX documentation audit to check the centered resource
   group and the explicit heading hierarchy without removing existing checks.
6. Add formatting-only review guidance to the existing review workflow. Verify
   rendered semantic content against the fixed base; keep one-off comparison
   artifacts outside the tracked repository.
7. Run the full Orb quality gate and inspect the npm payload. Merge the PR into
   staging only after final-head reviews, CI and any applicable deployment checks
   pass, with no unresolved conflicts. The owner explicitly authorized the spec,
   implementation, harness updates, publication of the PR, conflict/validation
   repair and conditional merge in the current request.

## Acceptance criteria

- [x] The four existing resource links render as a centered group with no new text.
- [x] Subordinate headings and major-section spacing improve scanning while labels,
      section order and native anchors remain unchanged.
- [x] Parsed visible text, ordered links/images, inline code and table contents
      match the fixed base after whitespace normalization; fenced code matches
      exactly, including language and whitespace.
- [x] The documentation audit rejects missing/misordered resource links and
      incorrect heading levels; the unmodified baseline fails the new checks.
- [x] The spec catalog and review workflow record the bounded change and the
      content-preservation review procedure.
- [x] `./cli/orb check`, package inspection and independent implementation review pass.

## Evidence

- Baseline: `25280faac6ba9932559f97e06ed72e8101a9806f:README.md`.
- `README.md`, `.audits/documentation.audit.sh`, `.agents/workflows/review.md`.
- GFM rendering with Marked and Happy DOM preserved all normalized visible text,
  19 ordered heading labels, 8 links, 5 images, 187 exact code spans/blocks and
  98 table cells against the fixed base. Language and whitespace inside code
  were compared without normalization.
- The new documentation audit failed on the untouched baseline with five
  presentation findings and passed on the implementation. Four isolated negative
  probes were rejected: missing resource, reordered resources, changed resource
  destination and incorrect subordinate heading level.
- `./cli/orb check` passed: lint, both TypeScript checks, tests, both builds,
  SemVer validation and all repository audits.
- `npm pack --dry-run` passed, including its prepack gate; package contents
  retain the existing distribution boundary.
- Independent implementation review and `git diff --check` passed with no
  blocking findings. Final-head review, CI/deployment status and merge evidence
  are recorded in the PR before merge; completion here does not waive those gates.

## Related records

- [SPEC-011](./011-add-readme-banner-and-tooling-guide.spec.md): existing assets.
- [SPEC-014](./014-consolidate-orb-commands-and-add-npx-setup.spec.md): installer copy.
- [Rule 007](../rules/007-harness-documentation-and-audits.rule.md): documentation.
- [Rule 004](../rules/004-web-component-accessibility-and-localization.rule.md): accessibility.
- [Rule 005](../rules/005-voice-and-speech.rule.md): speech documentation.
- [Rule 012](../rules/012-agent-runtime-guardrails.rule.md): approved merge boundary.
- No new ADR: the package architecture and public contract are unchanged.

## Compatibility and risks

This is presentation-only documentation work. The main risks are accidentally
changing a command or URL and using HTML that GitHub renders poorly. Semantic
comparison and the existing Markdown/native-heading structure address these
risks. No runtime, SSR, speech, accessibility API, localization, version or npm
publication change is authorized by this spec. Restore the prior presentation
and its audit expectations to roll back the change.
