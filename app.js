// Supports ES6
const venom = require("venom-bot");
const mysql = require("mysql2");
require("dotenv").config();
const qr = require("qr-image");
let clientWhats;
const TIME_INTERVAL = 4000;
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
 

function getMessage(smsCode) {
  return `*Petiscaria Movimento*: Olá, aqui está seu código de conformação para registrar sua conta: *${smsCode}*`;
}

// function getQrCode(phone) {
//   console.log("qrsvg");
//   var svg_string = qr.imageSync("I love QR!", { type: "png" });
//   console.log(btoasvg_string.toString());
  
//   clientWhats
//     .sendFileFromBase64(
//       `55${phone}@broadcast`,
//       svg_string.toString(),
//       "file_name.png",
//       "See my file in png"
//     )

//     .then(async (result) => {
//       console.log("Whatsapp message sent!");
//     })
//     .catch(async (erro) => {
//       console.error("Error when sending: ", erro); //return object error
//       // console.error("Error when sending: "); //return object error
//     });
// }

async function getUserSendCode() {
  setInterval(async () => {
    const users = await queryDB(
      `SELECT * FROM users WHERE smsStatus = 'notconfirmed' LIMIT 1`
    );

    if (users.length) {
      const idUser = users[0].idUser;
      const phoneUser = users[0].phone;
      const smsCode = users[0].smsCode;
      clientWhats
        .sendText(`55${phoneUser}@broadcast`, getMessage(smsCode))
        .then(async (result) => {
          // console.log("Result: ", result); //return object success
          console.log("Whatsapp message sent!");
          const users = await queryDB(
            `UPDATE users SET smsStatus = 'confirmed' WHERE idUser = '${idUser}'`
          );
        })
        .catch(async (erro) => {
          console.error("Error when sending: ", erro); //return object error
          // console.error("Error when sending: "); //return object error
          const users = await queryDB(
            `UPDATE users SET smsStatus = 'notconfirmed-error-send-msg-whats' WHERE idUser = '${idUser}'`
          );
        });
    }
  }, TIME_INTERVAL);
}

function start(client) {
  clientWhats = client;
  // getUserSendCode();
    client.onMessage((message) => {
      console.log('Client message', message.body)
  if (message.body === "Hi" && message.isGroupMsg === false) {
    clientWhats = client
      .sendText("557488578851@broadcast", "Welcome Venom 🕷")
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  }
    });
}

function handleDisconnect() {
  // Recreate the connection, since
  // the old one cannot be reused.
  connection = mysql.createConnection({
    host: process.env.HOST, // Host do banco de dados
    user: process.env.USER, // Nome de usuário do banco de dados
    password: process.env.PASSWORD, // Senha do banco de dados
    database: process.env.DATABASE, // Nome do banco de dados
  });
  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  console.log("Banco de dados = OK");
  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
async function queryDB(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        console.error("Erro na consulta:", err);
        reject(err);
      } else {
        // console.log(rows);
        resolve(rows);
      }
    });
  });
}

const OPTIONS = {
  browserPathExecutable: "", // browser executable path
  folderNameToken: "tokens", //folder name when saving tokens
  mkdirFolderToken: "", //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
  headless: "new", // you should no longer use boolean false or true, now use false, true or 'new' learn more https://developer.chrome.com/articles/new-headless/
  devtools: false, // Open devtools by default
  debug: true, // Opens a debug session
  logQR: true, // Logs QR automatically in terminal
  browserWS: "", // If u want to use browserWSEndpoint
  browserArgs: [""], // Original parameters  ---Parameters to be added into the chrome browser instance
  addBrowserArgs: [""], // Add broserArgs without overwriting the project's original
  puppeteerOptions: {}, // Will be passed to puppeteer.launch
  disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
  disableWelcome: true, // Will disable the welcoming message which appears in the beginning
  updatesLog: true, // Logs info updates automatically in terminal
  autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
  createPathFileToken: false, // creates a folder when inserting an object in the client's browser, to work it is necessary to pass the parameters in the function create browserSessionToken
  addProxy: [""], // Add proxy server exemple : [e1.p.webshare.io:01, e1.p.webshare.io:01]
  userProxy: "", // Proxy login username
  userPass: "", // Proxy password
};

function startVenom() {
  venom
    .create(
      { session: "session-name" },
      () => {},
      (statusSession, session) => {
        console.log("statusSession:::", statusSession);
      },
      OPTIONS
    )
    .then((client) => start(client))
    .catch((erro) => {
      console.log(erro);
    });
}

startVenom();
// getQrCode();
// handleDisconnect();

