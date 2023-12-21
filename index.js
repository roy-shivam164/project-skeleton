#!/usr/bin/env node
import { promises as fs } from 'fs';
import { join } from 'path';
// import { prompt } from 'inquirer';
import inquirer from 'inquirer';

const defaultFolders = ['db', 'controllers', 'components', 'routes', 'middlewares'];

async function createProjectStructure(projectName, chosenFolders, customFolderName) {
  try {
    const baseDir = process.cwd();
    const projectDir = customFolderName ? join(baseDir, customFolderName) : join(baseDir, projectName);

    // Create the project folder and chosen folders inside the project directory
    await fs.mkdir(projectDir, { recursive: true });
    await Promise.all(chosenFolders.map(folder => fs.mkdir(join(projectDir, folder), { recursive: true })));
    // Create .env file in the project directory
    await createEnvFile(baseDir);

    // Create docs folder outside of the src directory
    await createDocsFolder(baseDir);

    //create liscense file to maintain your license for the project
    await createLiscense(baseDir)

  

    console.log('\x1b[32m%s\x1b[0m','Project structure created successfully!');
    console.log('\x1b[32m%s\x1b[0m','.env, License.txt and docs folder created successfully!')
  } catch (err) {
    console.error(err);
  }
}

async function createLiscense(projectDir){
  const envFilePath = join(projectDir, 'LICENSE.txt')
  const envFileContent = 'Write about Your License here'
  await fs.writeFile(envFilePath, envFileContent, 'utf-8')
}

async function createEnvFile(projectDir) {
  const envFilePath = join(projectDir, '.env');
  const envFileContent = '# Add your environment variables here';

  await fs.writeFile(envFilePath, envFileContent, 'utf-8');
}

async function createDocsFolder(baseDir) {
  const docsFolderPath = join(baseDir, 'docs');

  // Ensure the folder exists before creating it
  await fs.mkdir(docsFolderPath, { recursive: true });
}


async function run() {
  try {
    const [, , ...args] = process.argv;
    // if (args.length === 0) {
    //   console.error('Usage: my-project-generator <project-name> [options]');
    //   process.exit(1);
    // }

    const projectName = 'src';

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'customFolderName',
        message: 'Enter a custom folder name (press Enter to use default name as \'src\'):',
      },
      {
        type: 'checkbox',
        name: 'chosenFolders',
        message: 'Select folders to create in the project directory:',
        choices: defaultFolders,
      },
      
    ]);

    await createProjectStructure(projectName, answers.chosenFolders, answers.customFolderName);
  } catch (err) {
    console.error(err);
  }
}
export default run;
run();
