const fs = require('fs');
const path = require('path');

const configs = [
  { name: 'git-and-github', start: 6, end: 15 },
  { name: 'fe', start: 16, end: 25 },
  { name: 'aws', start: 11, end: 20 },
  { name: 'database-engineering', start: 11, end: 20 },
  { name: 'devops-engineering', start: 11, end: 20 },
  { name: 'business-japanese-test', start: 11, end: 20 },
  { name: 'system-design', start: 11, end: 20 },
  { name: 'data-structures-and-algorithms', start: 11, end: 20 },
  { name: 'developer-mindset', start: 11, end: 20 },
  { name: 'cybersecurity-awareness', start: 11, end: 20 },
  { name: 'blockchain-and-web3-fundamentals', start: 11, end: 20 }
];

configs.forEach((cfg) => {
  const tempDir = path.resolve(__dirname, `../lessons/quizzes/temp-add-${cfg.name}`);
  const baseFile = path.resolve(__dirname, `../lessons/quizzes/${cfg.name}.json`);
  if (!fs.existsSync(tempDir)) return;
  if (!fs.existsSync(baseFile)) {
    console.error(`Base file ${baseFile} does not exist.`);
    return;
  }

  let quiz;
  try {
    quiz = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
  } catch (e) {
    console.error(`Error parsing base file ${baseFile}:`, e);
    return;
  }

  if (!quiz.sets) {
    quiz.sets = [];
  }

  const existingSetIds = new Set(quiz.sets.map(s => s.id));
  const newSets = [];

  for (let i = cfg.start; i <= cfg.end; i++) {
    const filePath = path.join(tempDir, `set-${i}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!existingSetIds.has(parsed.id)) {
          newSets.push(parsed);
        } else {
          console.log(`Set ${parsed.id} already exists in ${cfg.name}.json. Skipping duplicate.`);
        }
      } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
      }
    }
  }

  if (newSets.length === (cfg.end - cfg.start + 1)) {
    quiz.sets.push(...newSets);
    fs.writeFileSync(baseFile, JSON.stringify(quiz, null, 2), 'utf8');
    console.log(`Successfully appended ${newSets.length} sets to ${cfg.name}.json.`);
  } else {
    console.warn(`Warning: ${cfg.name} has only ${newSets.length} new sets out of ${cfg.end - cfg.start + 1}. Skipping compile.`);
  }
});
