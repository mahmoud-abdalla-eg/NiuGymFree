# Gates: Repository Consolidation and Root Clutter Elimination

OWNS: frontend/**, backend/**, docs/**, README.md, GATES.md

Scope: Remove legacy duplicate files from outer folder, consolidate development purely inside Main Project Repo, ensure frontend dependencies are installed and building, launch dev server from Main Project Repo/frontend, and push all updates to GitHub.

- [ ] G1: Archive reference prototypes and SPEC into Main Project Repo/docs/references
  CHECK: node -e "const fs = require('fs'); const ok = fs.existsSync('docs/references/SPEC.md') && fs.existsSync('docs/references/reference-prototype.jsx'); if (ok) { console.log('ARCHIVE_OK'); process.exit(0); } else { process.exit(1); }"
  EXPECT: ARCHIVE_OK
  CWD: Main Project Repo
  EVIDENCE: pending

- [ ] G2: Verify outer root directory contains only Main Project Repo
  CHECK: node -e "const fs = require('fs'); const items = fs.readdirSync('.').filter(n => !n.startsWith('.') && n !== 'Main Project Repo'); if (items.length === 0) { console.log('ROOT_CLEAN'); process.exit(0); } else { console.log('REMAINING:', items); process.exit(1); }"
  EXPECT: ROOT_CLEAN
  EVIDENCE: pending

- [ ] G3: Verify Main Project Repo frontend builds cleanly
  CHECK: npm run build
  EXPECT: built in
  CWD: Main Project Repo/frontend
  EVIDENCE: pending

- [ ] G4: Verify Main Project Repo backend builds cleanly
  CHECK: npm run build
  EXPECT: niugymfree-backend@1.0.0 build
  CWD: Main Project Repo/backend
  EVIDENCE: pending

- [ ] G5: Push consolidated repository cleanly to GitHub
  CHECK: git status --porcelain
  EXPECT: CLEAN
  CWD: Main Project Repo
  EVIDENCE: pending
