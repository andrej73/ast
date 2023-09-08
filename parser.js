const { Project, DiagnosticCategory } = require('ts-morph');
const prettier = require('prettier');
const path = require('path');
const fs = require('fs').promises; 

const project = new Project();

// Create new output directory if there isn't any
async function ensureOutputDirectoryExists() {
    try {
        await fs.access(outputDirectory);
    } catch (error) {
        await fs.mkdir(outputDirectory, { recursive: true });
    }
}

async function renameAndSaveFiles(inputDirectory, outputDirectory, entityName) {
    const testFilesDirectory = project.addSourceFilesAtPaths(`${inputDirectory}/**/*{.d.ts,.ts,.tsx}`);
    const promises = [];

    if (testFilesDirectory.length === 0) {
        console.error(`No *.tsx files found in "${inputDirectory}" or its subdirectories.`);
        process.exit(1);
    }

    await ensureOutputDirectoryExists();

    for (const sourceFile of testFilesDirectory) {

        const syntaxDiagnostics = sourceFile.getPreEmitDiagnostics().filter(diagnostic => diagnostic.getCategory() === DiagnosticCategory.Error);
        // Check for syntax errors in source files
        if (syntaxDiagnostics.length > 0) {
            console.error(`Syntax errors found in "${sourceFile.getFilePath()}":`);
            syntaxDiagnostics.forEach(diagnostic => {
                console.error(diagnostic.getMessageText());
            });
            // Ideally we would skip the files with syntax errors but there's one JSX error I cannot get rid of so this is commented out
            // continue; 
        }

        // Traverse AST and replace w/ regex 
        sourceFile.forEachDescendant((node) => {
            if (node.getKindName() === "Identifier" && /Entity|entity/.test(node.getText())) {
                const updatedText = node.getText().replace(/Entity|entity/g, entityName);
                node.replaceWithText(updatedText);
            }
        });

        // Format AST w/ prettier
        const formattedCode = prettier.format(sourceFile.getFullText(), {
            parser: 'typescript',
            singleQuote: true, 
        });

        // Rename file and save in new directory
        const newFilename = sourceFile.getBaseName().replace(/Entity|entity/g, entityName);
        const outputFilePath = path.join(outputDirectory, newFilename);
        const normalizedOutputPath = outputFilePath.replace(/\\/g, '/');
        promises.push(fs.writeFile(normalizedOutputPath, (await formattedCode).toString()).then(() => normalizedOutputPath));
    }

    const modifiedFilePaths = await Promise.all(promises);
    console.log('Files have been modified and saved here:', modifiedFilePaths);
}

// Example of input arguments
// const inputDirectory = "./TestFiles"
// const outputDirectory = "./ModifiedFiles";
// const entityName = "Replaced";

// CLI
const args = process.argv.slice(2);
if (args.length < 3) {
    console.error('Usage: node parser.js inputDirectory outputDirectory entityName');
    process.exit(1);
}
const inputDirectory = args[0];
const outputDirectory = args[1];
const entityName = args[2];

renameAndSaveFiles(inputDirectory, outputDirectory, entityName)
    .catch((error) => {
        console.error('An error occurred:', error);
    });