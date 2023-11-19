# JESW-SUITE - Express-Setup-Wizard
`jesw` is a Node.js CLI tool designed to streamline the process of setting up a new Express.js application (MVC), particularly focusing on creating a robust authentication system. This tool generates boilerplate code for Express applications, helping developers kickstart their projects with essential features like user authentication, database connection setup, and basic routing.

## Features

- **Quick Setup**: Easily set up the structure of an Express.js application with essential configurations.
- **Authentication Boilerplate**: Generates code for user registration and login, including password hashing and JWT handling.
- **Customizable**: Interactive CLI prompts for custom configurations like MongoDB connection strings and JWT secrets.
- **Modular Code**: Organized file structure with models, routes, and controllers for better maintainability.

## Installation

To install `jesw`, run the following command in your terminal:

```bash
npm install -g jesw-suite
```

This will install `jesw` globally on your machine, allowing you to use it in any directory.

## Usage

To create a new Express.js project with authentication setup, navigate to your desired directory and run:

```bash
jesw-suite 
```

or

```bash
jesw-suite --name newprojectName
```


Follow the interactive prompts to configure your application. `jesw` will create the necessary files and directories based on your input.

## Generated Project Structure

The tool generates the following structure for your Express application:

```
project-name/
···
··· models/
······ userModel.js
··· routes/
······ authRoutes.js
··· controllers/
······ authController.js
··· test/
······ auth.test.js
··· app.js
```

## Contributing

Contributions to `jesw` are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the [MIT License](LICENSE).

## Support

If you have any questions or need help with `jesw`, please open an issue in the [GitHub repository](https://github.com/yourusername/jesw).

## Acknowledgements

- Node.js Community
- Express.js Team

---

Created by [Japsimran Singh](https://github.com/japsimrans13) - Feel free to connect with me on GitHub!