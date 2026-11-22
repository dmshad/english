// No dependencies. Produces a single HTML file that can be opened via file://.
const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname, '..');
let html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + fs.readFileSync(path.join(base, 'styles.css'), 'utf8') + '\n</style>');
html = html.replace(/<script src="([a-z0-9-]+\.js)"><\/script>/g, (_, file) => '<script>\n' + fs.readFileSync(path.join(base, file), 'utf8').replace(/<\/script/gi, '<\\/script') + '\n</script>');
if (/<script\b[^>]*\bsrc\s*=|<link\b[^>]*rel="stylesheet"/i.test(html)) throw new Error('External application resource remains in the standalone file');
for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new (require('node:vm').Script)(match[1]);
fs.mkdirSync(path.join(base, 'dist'), {recursive: true});
fs.writeFileSync(path.join(base, 'dist/index.html'), html);
fs.writeFileSync(path.resolve(base, '../index.html'), html);
console.log('Built index.html and everyday-offline/dist/index.html (' + Buffer.byteLength(html) + ' bytes each)');
