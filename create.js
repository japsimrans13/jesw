#!/usr/bin/env node

const fs = require("fs");
const crypto = require('crypto');
const { exec } = require("child_process");
const minimist = require("minimist");
const chalk = require('chalk');

// content-files import 
const {appJsContent} = require('./content-files/app.js');
const {userModelContent} = require('./content-files/models/UserModel.js');
const {userRoutesContent} = require('./content-files/routes/userRoutes.js');
const {userControllerContent} = require('./content-files/controllers/userControllers.js');
const {authMiddlewareContent} = require('./content-files/middlewares/authMiddlewares.js');
const {authTestContent} = require('./content-files/test/auth.test.js');


console.log(chalk.blue("Welcome to Express.js Setup Wizard"));
const args = minimist(process.argv.slice(2));
const projectName = args.name;
// const projectName = ""; // Use when testing locally
console.log(chalk.blue("Project name: "+projectName));
// Check if a project already exists in the current directory(check for package.json) and project directory not specified 
if (fs.existsSync("package.json") && !projectName) {
  console.log(chalk.red("package.json file found !!! A project already exists in this directory."));
  console.log("Exited..");
  process.exit(1);
}

if (projectName) {
  console.log(chalk.blue(`Project name is given as an argument, Using ${projectName} as project directory`));
  // Create project directory
if (!fs.existsSync(projectName)) {
  console.log(chalk.yellowBright("Creating project directory named: "+projectName));
  fs.mkdirSync(projectName);
} else {
  console.log(chalk.red(`A directory named ${projectName} already exists.`));
  console.log("Exited..");
  process.exit(1);
}
}



const generateBoilerplate = () => {
  // Generate a random JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');

  if (projectName) {
  console.log(chalk.yellowBright("Generating boilerplate... of project name: "+projectName));
  }
    // Directory structure
  const directories = [`${projectName ? `${projectName}/` : ''}/models`, `${projectName ? `${projectName}/` : ''}/routes`, `${projectName ? `${projectName}/` : ''}/controllers`, `${projectName ? `${projectName}/` : ''}/test`, `${projectName ? `${projectName}/` : ''}/middlewares`];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/app.js`, appJsContent());
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/models/userModel.js`, userModelContent());
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/routes/userRoutes.js`, userRoutesContent());
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/controllers/userController.js`, userControllerContent());
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/test/auth.test.js`, authTestContent());
    fs.writeFileSync(`${projectName ? `${projectName}/` : ''}/middlewares/authMiddleware.js`, authMiddlewareContent());
    fs.writeFileSync(
      `${projectName ? `${projectName}/` : ''}/.env`,
      `MONGODB_URI=your_mongodb_connection_string\nJWT_SECRET=${jwtSecret}\nPORT=8000
      `
    );
  
  // else {
  //   // Directory structure
  // const directories = ["models", "routes", "controllers", "middlewares", "test"];
  // directories.forEach((dir) => {
  //   if (!fs.existsSync(dir)) {
  //     fs.mkdirSync(dir);
  //   }
  // });
  // // Generate files with basic code
  // fs.writeFileSync("app.js", appJsContent());
  // fs.writeFileSync("models/userModel.js", userModelContent());
  // fs.writeFileSync("routes/userRoutes.js", userRoutesContent());
  // fs.writeFileSync("controllers/userController.js", userControllerContent());
  // fs.writeFileSync("test/auth.test.js", authTestContent());
  // fs.writeFileSync("middlewares/authMiddleware.js", authMiddlewareContent());
  // fs.writeFileSync(
  //   ".env",
  //   `MONGODB_URI=your_mongodb_connection_string\nJWT_SECRET=${jwtSecret}`
  // );
  // }
  createPackageJson();
  // Install packages
  installPackages(() => {
    console.log(chalk.yellowBright(
      "Boilerplate generated successfully. Please update the .env file with your MongoDB connection string and JWT secret."
    ));
  });
};




const createPackageJson = () => {
  const packageJsonContent = {
    name: projectName || 'my-express-app',
    version: '1.0.0',
    description: 'An Express.js project created using jesw-suite',
    main: 'app.js',
    scripts: {
      start: 'node app.js',
      dev: "nodemon app.js",
      test: 'mocha --reporter spec --exit'
    },
    dependencies: {
      express: '^4.17.1',
      mongoose: '^5.11.15',
      bcryptjs: '^2.4.3',
      dotenv: '^8.2.0',
      jsonwebtoken: '^8.5.1'
    },
    devDependencies: {
      chai: '^4.2.0',
      'chai-http': '^4.3.0',
      mocha: '^8.2.1',
      nodemon: '^3.0.3'
      
    }
  };

  fs.writeFileSync(`${projectName ? `${projectName}/` : ''}package.json`, JSON.stringify(packageJsonContent, null, 2));
};


const installPackages = (callback) => {
  console.log("Installing required packages...");
  if (projectName) {
    exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error occurred: ${error}`);
        return;
      }
      if (stderr) {
        console.log(`Error occurred: ${stderr}`);
        return;
      }
      console.log(stdout);
      callback();
    });
  }
  else {
  exec("npm install", (error, stdout, stderr) => {
    if (error) {
      console.log(`Error occurred: ${error}`);
      return;
    }
    if (stderr) {
      console.log(`Error occurred: ${stderr}`);
      return;
    }
    console.log(stdout);
    callback();
  });
}
};

generateBoilerplate();
