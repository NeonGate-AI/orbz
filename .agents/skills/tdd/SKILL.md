# Orbz TDD procedure

1. Express the observable failure through the smallest public-contract test.
2. Run the test and confirm it fails for the intended reason.
3. Implement the minimum behavior that makes it pass.
4. Refactor without widening public APIs accidentally.
5. Add negative cases for blank input, missing DOM, cancellation, and stale async work where applicable.
6. Run the complete suite and audits.

Prefer real objects for pure code, small typed fakes for ports, and global stubs
only at browser boundaries. Never assert private closed-shadow descendants.
