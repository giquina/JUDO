#!/usr/bin/env node

/**
 * JUDO APP - Documentation Updater
 *
 * Scans the codebase for TODO/FIXME/HACK comments and updates:
 * - TODO.md with found items
 * - SUGGESTIONS.md with recommendations
 * - Updates timestamps in both files
 *
 * Usage:
 *   node scripts/update-docs.mjs           # Full update
 *   node scripts/update-docs.mjs --silent  # Update without console output
 *   node scripts/update-docs.mjs --scan-only  # Just scan, don't update files
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Configuration
const CONFIG = {
  scanPatterns: ['TODO', 'FIXME', 'HACK', 'XXX', 'BUG', 'OPTIMIZE'],
  scanDirectories: ['src', 'convex'],
  excludeDirectories: ['node_modules', 'dist', '.git', 'coverage'],
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'],
  todoFile: 'TODO.md',
  suggestionsFile: 'SUGGESTIONS.md'
};

// Parse command line arguments
const args = process.argv.slice(2);
const silent = args.includes('--silent');
const scanOnly = args.includes('--scan-only');

function log(...messages) {
  if (!silent) console.log(...messages);
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dir, files = []) {
  if (!existsSync(dir)) return files;

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!CONFIG.excludeDirectories.includes(entry)) {
        scanDirectory(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = extname(entry);
      if (CONFIG.fileExtensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Extract TODO/FIXME comments from a file
 */
function extractComments(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const comments = [];
  const patternRegex = new RegExp(`\\b(${CONFIG.scanPatterns.join('|')})\\b:?\\s*(.*)`, 'i');

  lines.forEach((line, index) => {
    const match = line.match(patternRegex);
    if (match) {
      comments.push({
        file: relative(projectRoot, filePath).replace(/\\/g, '/'),
        line: index + 1,
        type: match[1].toUpperCase(),
        text: match[2].trim() || '(no description)',
        raw: line.trim()
      });
    }
  });

  return comments;
}

/**
 * Get TypeScript errors (if tsc is available)
 */
function getTypeScriptErrors() {
  try {
    execSync('npx tsc --noEmit 2>&1', {
      cwd: projectRoot,
      encoding: 'utf-8',
      timeout: 30000
    });
    return [];
  } catch (error) {
    const output = error.stdout || error.message || '';
    const errors = [];
    const errorRegex = /(.+\.tsx?)\((\d+),\d+\): error TS\d+: (.+)/g;
    let match;

    while ((match = errorRegex.exec(output)) !== null) {
      errors.push({
        file: match[1].replace(/\\/g, '/'),
        line: parseInt(match[2]),
        message: match[3]
      });
    }

    return errors.slice(0, 20); // Limit to 20 errors
  }
}

/**
 * Generate TODO.md content
 */
function generateTodoContent(comments) {
  const now = new Date().toISOString().split('T')[0];
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  // Group by type
  const grouped = {};
  for (const comment of comments) {
    if (!grouped[comment.type]) grouped[comment.type] = [];
    grouped[comment.type].push(comment);
  }

  let content = `# TODO - JUDO APP

> Auto-generated from codebase scan
> **Last Updated:** ${timestamp}

---

## Summary

| Type | Count |
|------|-------|
`;

  const typeOrder = ['TODO', 'FIXME', 'BUG', 'HACK', 'XXX', 'OPTIMIZE'];
  for (const type of typeOrder) {
    if (grouped[type]) {
      content += `| ${type} | ${grouped[type].length} |\n`;
    }
  }

  content += `| **Total** | **${comments.length}** |\n\n---\n\n`;

  // List by type
  for (const type of typeOrder) {
    if (grouped[type] && grouped[type].length > 0) {
      content += `## ${type}\n\n`;

      for (const item of grouped[type]) {
        content += `- [ ] **${item.file}:${item.line}** - ${item.text}\n`;
      }

      content += '\n';
    }
  }

  // Manual tasks section
  content += `---

## Manual Tasks

_Add manual tasks below. They won't be overwritten by the scanner._

- [ ] Complete Convex authentication (magic links)
- [ ] Integrate Stripe payments
- [ ] Add push notifications
- [ ] Performance optimization pass

---

## Notes

- Run \`node scripts/update-docs.mjs\` to refresh this file
- Comments matching ${CONFIG.scanPatterns.join(', ')} are scanned
- Scanned directories: ${CONFIG.scanDirectories.join(', ')}

`;

  return content;
}

/**
 * Generate SUGGESTIONS.md content
 */
function generateSuggestionsContent(comments, tsErrors) {
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  let content = `# SUGGESTIONS - JUDO APP

> Auto-generated improvement suggestions
> **Last Updated:** ${timestamp}

---

## Code Quality Indicators

### TODO/FIXME Density
`;

  const todoCount = comments.filter(c => c.type === 'TODO').length;
  const fixmeCount = comments.filter(c => c.type === 'FIXME').length;
  const hackCount = comments.filter(c => c.type === 'HACK').length;

  if (todoCount === 0 && fixmeCount === 0) {
    content += `Excellent! No pending TODO or FIXME items found.\n\n`;
  } else {
    if (todoCount > 5) {
      content += `- Consider addressing ${todoCount} TODO items to reduce technical debt\n`;
    }
    if (fixmeCount > 0) {
      content += `- **Priority:** ${fixmeCount} FIXME items should be resolved soon\n`;
    }
    if (hackCount > 0) {
      content += `- **Technical Debt:** ${hackCount} HACK comments indicate workarounds that need proper solutions\n`;
    }
    content += '\n';
  }

  // TypeScript errors section
  content += `### TypeScript Health\n\n`;

  if (tsErrors.length === 0) {
    content += `No TypeScript errors detected. Build is clean.\n\n`;
  } else {
    content += `**${tsErrors.length} TypeScript error(s) detected:**\n\n`;
    for (const error of tsErrors.slice(0, 10)) {
      content += `- \`${error.file}:${error.line}\` - ${error.message}\n`;
    }
    if (tsErrors.length > 10) {
      content += `- ... and ${tsErrors.length - 10} more errors\n`;
    }
    content += '\n';
  }

  // General suggestions
  content += `---

## Improvement Suggestions

### High Priority
- Complete Convex authentication integration
- Replace mock data with real Convex queries
- Implement proper error boundaries

### Medium Priority
- Add comprehensive test coverage
- Implement proper loading states everywhere
- Add input validation with Zod

### Low Priority
- Add keyboard navigation
- Improve accessibility (a11y audit)
- Add analytics tracking

---

## Performance Suggestions

- Consider code splitting for dashboard pages
- Lazy load heavy components
- Optimize images with next-gen formats
- Implement virtual scrolling for long lists

---

## Security Checklist

- [ ] Implement proper authentication
- [ ] Add rate limiting
- [ ] Sanitize all user inputs
- [ ] Review Convex security rules
- [ ] Add CSRF protection

---

## Notes

This file is auto-updated by \`node scripts/update-docs.mjs\`

`;

  return content;
}

/**
 * Main execution
 */
async function main() {
  log('');
  log('JUDO APP - Documentation Updater');
  log('=================================');
  log('');

  // Scan all directories
  let allFiles = [];
  for (const dir of CONFIG.scanDirectories) {
    const dirPath = resolve(projectRoot, dir);
    const files = scanDirectory(dirPath);
    allFiles = allFiles.concat(files);
  }

  log(`Scanning ${allFiles.length} files...`);

  // Extract comments
  const allComments = [];
  for (const file of allFiles) {
    const comments = extractComments(file);
    allComments.push(...comments);
  }

  log(`Found ${allComments.length} TODO/FIXME/HACK comments`);

  // Get TypeScript errors
  log('Checking TypeScript...');
  const tsErrors = getTypeScriptErrors();
  log(`Found ${tsErrors.length} TypeScript errors`);

  if (scanOnly) {
    log('');
    log('--- Scan Results ---');
    for (const comment of allComments) {
      log(`[${comment.type}] ${comment.file}:${comment.line} - ${comment.text}`);
    }
    log('');
    log('(--scan-only mode: files not updated)');
    return;
  }

  // Generate and write TODO.md
  const todoContent = generateTodoContent(allComments);
  const todoPath = resolve(projectRoot, CONFIG.todoFile);
  writeFileSync(todoPath, todoContent, 'utf-8');
  log(`Updated: ${CONFIG.todoFile}`);

  // Generate and write SUGGESTIONS.md
  const suggestionsContent = generateSuggestionsContent(allComments, tsErrors);
  const suggestionsPath = resolve(projectRoot, CONFIG.suggestionsFile);
  writeFileSync(suggestionsPath, suggestionsContent, 'utf-8');
  log(`Updated: ${CONFIG.suggestionsFile}`);

  log('');
  log('Documentation update complete!');
  log('');
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
