import fs from 'fs';
import { execSync } from 'child_process';
import semver from 'semver';
import { build } from 'vite';

const packageJsonPath = './package.json';
//const appsscriptPath = './library/build/appsscript.json'; // Path to your appsscript.json file
const incrementType = process.argv[2]; // Ensure this argument is provided

// Read package.json and appsscript.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
//const appsscriptJson = JSON.parse(fs.readFileSync(appsscriptPath, 'utf-8'));
let currentVersion = packageJson.version;
const isDevVersion = currentVersion.includes('-dev');

//const status = execSync('git status --porcelain').toString().trim();
// if (status) {
//   console.log('There are changes to commit first.');
// } else 

// if (!isDevVersion) {
//   console.log('We are not on a dev version. Fix the version manually first.');
// } else {
let publishVersion = currentVersion.replace('-dev', '');

if (!isDevVersion || incrementType === 'minor' || incrementType == 'major') {
  publishVersion = semver.inc(publishVersion, incrementType)
}
writeVersionFiles(publishVersion);
buildSrc();
execSync(`clasp push`);
execSync(`clasp deploy --description ${JSON.stringify("Version " + publishVersion)}`);
commit(`Publish ${publishVersion}`, publishVersion);

// we prepare the next build (presumably a patch)
const newDevVersion = semver.inc(publishVersion, 'patch') + '-dev';

writeVersionFiles(newDevVersion);
buildSrc();
execSync(`clasp push`);
commit(`Start development on ${newDevVersion}`);
console.log("Done");

//}

function buildSrc() {
  execSync('tsc --build library');
  execSync('tsc'); // this only check the syntax. vite does the client build.
  execSync('vite build');
}

function commit(message, publishVersion) {
  execSync('git add .');
  //execSync('git add package.json library/build/appsscript.json');
  execSync(`git commit -m ${JSON.stringify(message)}`);
  console.log(message);
  if (publishVersion) {
    execSync(`git tag -a ${publishVersion} -m "Version ${publishVersion}"`);
    execSync(`git push origin ${publishVersion}`);
  } else {
    execSync('git push origin main');
  }
}

function writeVersionFiles(version) {
  // Update version in package.json
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

  // Update version in appsscript.json (or similar property)
  //appsscriptJson.version = version; // Adjust this line based on your appsscript.json structure
  //fs.writeFileSync(appsscriptPath, JSON.stringify(appsscriptJson, null, 2) + '\n');

  fs.writeFileSync('./library/src/version.ts', `// This file is auto-generated during the build process
var formulaireBleuVersion = '${version}';
`);
  fs.writeFileSync('./src/version.ts', `// This file is auto-generated during the build process
export const formulaireBleuVersion = '${version}';
`);
}