#!/usr/bin/env node

const fs = require("fs");
const crypto = require('crypto');
const { exec } = require("child_process");
const minimist = require("minimist");
const chalk = require('chalk');

console.log(chalk.blue("Welcome to Express.js Setup Wizard"));
const args = minimist(process.argv.slice(2));
const projectName = args.name;
console.log(chalk.blue("Project name: "+projectName));
// Check if a project already exists in the current directory(check for package.json) and project directory not dpecified 
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
    // Directory structure
  const directories = [`${projectName}/models`, `${projectName}/routes`, `${projectName}/controllers`, `${projectName}/test`];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
    fs.writeFileSync(`${projectName}/app.js`, appJsContent());
    fs.writeFileSync(`${projectName}/models/userModel.js`, userModelContent());
    fs.writeFileSync(`${projectName}/routes/authRoutes.js`, authRoutesContent());
    fs.writeFileSync(`${projectName}/controllers/authController.js`, authControllerContent());
    fs.writeFileSync(`${projectName}/test/auth.test.js`, authTestContent());
    fs.writeFileSync(
      `${projectName}/.env`,
      `MONGODB_URI=your_mongodb_connection_string\nJWT_SECRET=${jwtSecret}`
    );
  }
  else {
    // Directory structure
  const directories = ["models", "routes", "controllers", "test"];
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  // Generate files with basic code
  fs.writeFileSync("app.js", appJsContent());
  fs.writeFileSync("models/userModel.js", userModelContent());
  fs.writeFileSync("routes/authRoutes.js", authRoutesContent());
  fs.writeFileSync("controllers/authController.js", authControllerContent());
  fs.writeFileSync("test/auth.test.js", authTestContent());
  fs.writeFileSync(
    ".env",
    `MONGODB_URI=your_mongodb_connection_string\nJWT_SECRET=${jwtSecret}`
  );
  }
  createPackageJson();
  // Install packages
  installPackages(() => {
    console.log(chalk.yellowBright(
      "Boilerplate generated successfully. Please update the .env file with your MongoDB connection string and JWT secret."
    ));
  });
};

const appJsContent = () => {
  return `require('dotenv').config();
  const express = require('express');
  const mongoose = require('mongoose');
  const authRoutes = require('./routes/authRoutes');
  
  const app = express();
  
  app.use(express.json());
  app.use('/api', authRoutes);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
  
  // MongoDB connection
  mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true,createIndexes: true})
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.log('Could not connect to MongoDB', err));
  
  // Export app for unit testing
  module.exports = app;
  `;
};

const userModelContent = () => {
  return `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

module.exports = mongoose.model('User', userSchema);
`;
};

const authRoutesContent = () => {
  return `const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
`;
};

const authControllerContent = () => {
  return `const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
`;
};


const authTestContent = () => {
  return `const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/userModel');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Authentication', () => {
  describe('POST /api/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/api/register')
        .send({ username: 'testuser', password: 'testpass' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          // Add more assertions as needed
          done();
        });
    });
  });

  // Add more tests as needed

  // Hook to run after each test in this block
  afterEach((done) => {
    // Delete the user created during the test
    User.deleteOne({ username: 'testuser1' })
      .then(() => done())
      .catch(err => done(err));
  });
});
`;
};

const createPackageJson = () => {
  const packageJsonContent = {
    name: projectName || 'my-express-app',
    version: '1.0.0',
    description: 'An Express.js project',
    main: 'app.js',
    scripts: {
      start: 'node app.js',
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
      mocha: '^8.2.1'
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
