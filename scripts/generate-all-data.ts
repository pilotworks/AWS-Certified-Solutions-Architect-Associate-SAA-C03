import { generateModulesMeta } from './generate-modules-meta';
import { generateDecisionMatrices } from './generate-decision-matrices';
import { generateArchitecturePatterns } from './generate-architecture-patterns';
import { generateFlashcards } from './generate-flashcards';
import { generateQuestions } from './generate-questions';
import { generateModulesContent } from './generate-modules-content';

console.log('🚀 Starting Data Pipeline Generation from docs/ ...\n');

try {
  console.log('📦 1/6 Generating Modules Metadata...');
  generateModulesMeta();

  console.log('\n📊 2/6 Generating Decision Matrices...');
  generateDecisionMatrices();

  console.log('\n🏗️  3/6 Generating Architecture Patterns...');
  generateArchitecturePatterns();

  console.log('\n🃏 4/6 Generating Flashcards Data...');
  generateFlashcards();

  console.log('\n❓ 5/6 Generating Practice Questions Data...');
  generateQuestions();

  console.log('\n📑 6/6 Compiling All Modules Markdown Content...');
  generateModulesContent();

  console.log('\n✨ All data artifacts successfully generated in src/data/ from docs!');
} catch (error) {
  console.error('\n❌ Data pipeline generation failed:', error);
  process.exit(1);
}
