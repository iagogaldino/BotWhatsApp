import * as venom from 'venom-bot';
export const createOptions: venom.CreateOptions = {
    session: "teste",
    // browserPathExecutable: "", // browser executable path
    folderNameToken: "tokens", //folder name when saving tokens
    mkdirFolderToken: "", //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
    headless: false, // you should no longer use boolean false or true, now use false, true or 'new' learn more https://developer.chrome.com/articles/new-headless/
    devtools: false, // Open devtools by default
    debug: true, // Opens a debug session
    logQR: true, // Logs QR automatically in terminal
    browserWS: "", // If u want to use browserWSEndpoint
    browserArgs: [""], // Original parameters  ---Parameters to be added into the chrome browser instance
    addBrowserArgs: [""], // Add broserArgs without overwriting the project's original
    puppeteerOptions: {
        timeout: 100000
        // handleSIGINT: true,
    }, // Will be passed to puppeteer.launch
    disableSpins: false, // Will disable Spinnies animation, useful for containers (docker) for a better log
    disableWelcome: true, // Will disable the welcoming message which appears in the beginning
    updatesLog: false, // Logs info updates automatically in terminal
    autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
    createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
    addProxy: [""], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
    userProxy: "", // Proxy login username
    userPass: "", // Proxy password

};