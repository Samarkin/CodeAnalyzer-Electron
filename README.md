# Code Analyzer

Can collect various statistics about your source code.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/Samarkin/CodeAnalyzer-Electron
# Go into the repository
cd CodeAnalyzer-Electron
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## To Package

```bash
# Go into the repository
cd CodeAnalyzer-Electron
# Install dependencies
npm install
# Compile and package
npm run dist
```

Packaged Electron application will be placed in the `dist` subfolder of the repository.

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
