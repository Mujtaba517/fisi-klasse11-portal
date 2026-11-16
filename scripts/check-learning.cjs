const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sandbox = { localStorage: { getItem: () => null, setItem: () => {} }, console };
vm.createContext(sandbox);
for (const file of ['catalog.js','revised.js','expanded.js','media.js']) vm.runInContext(fs.readFileSync(path.join(root, 'learning-'+file), 'utf8'), sandbox, { filename: file });
vm.runInContext(fs.readFileSync(path.join(root,'lumo-original.js'),'utf8'),sandbox);
const app = fs.readFileSync(path.join(root,'learning-app.js'),'utf8');
vm.runInContext(app.slice(0, app.indexOf("$('#langBtn').onclick=")), sandbox, { filename: 'app.js' });
vm.runInContext(`
const checks={lessons:0,rendered:0,cards:CARD_BANK.length,grades:{}};
if(grade!=='10')throw new Error('First visit must default to grade 10');
for(const c of CATALOG){
 checks.grades[c.grade]=(checks.grades[c.grade]||0)+c.order.length;
 for(const key of c.order){
  const r=REVISED[c.id+'/'+key];
  if(!r)throw new Error('Lesson without complete revision: '+c.id+'/'+key);
  if(!Array.isArray(r.source)||!/^https:\\/\\//.test(r.source[1]))throw new Error('Missing source: '+key);
  for(const language of ['de','fa']){
   const l=r[language];
   for(const field of ['title','goal','definition','explanation','example','summary','mistake','q','feedback'])if(!l[field]?.trim())throw new Error('Empty '+field+' '+c.id+'/'+key+' '+language);
   if(!Array.isArray(l.options)||l.options.length!==3||!Number.isInteger(l.answer)||l.answer<0||l.answer>2)throw new Error('Invalid answer '+key);
   if(l.terms.length<3||l.terms.some(x=>x.length!==2||!x[0]||!x[1]))throw new Error('Invalid glossary '+key);
   lang=language;const html=lessonPage(c,key);if(!html.includes(esc(l.title))||/>undefined<|\\[object Object\\]/.test(html))throw new Error('Broken lesson output '+c.id+'/'+key+' '+language);checks.rendered++;
  }
  if(r.de.answer!==r.fa.answer)throw new Error('Answer translations misaligned: '+key);
  if(r.de.terms.length!==r.fa.terms.length)throw new Error('Glossary translations misaligned: '+key);
  checks.lessons++;
 }
}
for(const g of ['10','11','12']){
 const full=bankFor(g,'all');if(full.length<50)throw new Error('Missing grade card pool '+g);
 for(const c of CATALOG.filter(c=>String(c.grade)===g)){
  const filtered=bankFor(g,c.id);if(!filtered.length||filtered.some(card=>card.grade!==g||card.course!==c.id))throw new Error('Incorrect subject filtering '+c.id);
 }
 cardGrade=g;cardSubject='all';cardLimit='20';resetStudy();if(studyDeck.length!==20)throw new Error('Round size');
 cardLimit='all';resetStudy();if(studyDeck.length!==full.length)throw new Error('All-card mode truncates');
 if(matchItems.length!==12||new Set(matchItems.map(x=>x.id)).size!==6)throw new Error('Pair game setup');
 quizGrade=g;quizSubject='all';resetQuiz();if(!quizDeck.length||quizDeck.some(k=>String(CATALOG.find(c=>c.id===k.split('/')[0]).grade)!==g))throw new Error('Quiz filter leak');
}
if(new Set(CARD_BANK.map(x=>x.id)).size!==CARD_BANK.length)throw new Error('Duplicate card IDs');
if(MOTIVATION.length<10)throw new Error('Motivational message pool too small');
if(Object.keys(LESSON_VIDEOS).length!==71)throw new Error('Video catalog missing files');
this.checks=checks;
`,sandbox);
assert.equal(sandbox.checks.lessons,99);
assert.equal(sandbox.checks.rendered,198);
console.log(JSON.stringify(sandbox.checks));
