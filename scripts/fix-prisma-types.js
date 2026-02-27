/**
 * Fixes Prisma v7 type resolution issue with moduleResolution: nodenext
 * Prisma v7 generates types in index.d.ts but default.d.ts is empty.
 * This script patches default.d.ts to re-export from index.d.ts.
 */
const fs = require('fs');
const path = require('path');

const defaultDts = path.join(
    __dirname,
    '..',
    'node_modules',
    '.prisma',
    'client',
    'default.d.ts',
);

if (fs.existsSync(defaultDts)) {
    const content = fs.readFileSync(defaultDts, 'utf8').trim();
    if (!content || content === '') {
        fs.writeFileSync(defaultDts, "export * from './index';\n");
        console.log('✔ Patched .prisma/client/default.d.ts');
    } else {
        console.log('✔ .prisma/client/default.d.ts already has content, skipping.');
    }
}
