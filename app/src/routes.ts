import { Request, Response } from "express";
import { app } from "./app";
import { createFile } from "./common/file";
import { sendEmail } from "./common/sendemail";
import { UserController } from "./controllers/user.controller";
import { VenomController } from "./controllers/venom-controller";
import { verifyToken } from "./middleware/middlewareJWT";

export function routers() {
    const venomDelsuc = new VenomController();

    app.get("/", (req: Request, res: Response) => {
        res.send("API BOT");
    });

    app.post("/login", async (req: Request, res: Response) => {
        const { phone, pass } = req.body;
        const userController = new UserController();
        const userLogin = await userController.login(phone, pass);
        if (userLogin) {
            res.send(userLogin);
        } else {
            res.status(500).send({ message: "Login ou senha incorreto" });
        }
    });

    app.get("/start-venom/:user", verifyToken, (req: Request, res: Response) => {
        venomDelsuc.venomCreate();
        res.send({});
    });

    app.post(
        "/send-message",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        (req: Request, res: Response) => {
            console.log(req.body);
            const { message, number } = req.body;
            if (!message) {
                return res.status(500).send({ message: "Error message null" });
            }
            if (!number) {
                return res.status(500).send({ message: "Error number null" });
            }
            venomDelsuc.sendMessage(number, message);
            res.send({});
        }
    );

    app.get(
        "/get-messages/:chatId",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        async (req: Request, res: Response) => {
            const chatId = req.params.chatId;
            if (!chatId) {
                return res.status(400).send({ message: "Error chatId null" });
            }
            const allMessages = venomDelsuc.loadAndGetAllMessagesInChat(chatId);
            res.send(allMessages);
        }
    );

    app.get(
        "/get-contacts",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        async (req: Request, res: Response) => {
            const contacts = await venomDelsuc.getContacts();
            res.send(contacts);
        }
    );

    app.get(
        "/get-all-messages-chat/:chatId",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        async (req: Request, res: Response) => {
            const chatId = req.params.chatId;
            if (!chatId) {
                return res.status(400).send({ message: "Error chatId null" });
            }
            const allMessages = venomDelsuc.getAllMessagesInChat(chatId);
            res.send(allMessages);
        }
    );

    app.get(
        "/get-earlier-messages",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        async (req: Request, res: Response) => {
            const messages = await venomDelsuc.loadEarlierMessages(
                "557488578851@c.us"
            );
            res.send(messages);
        }
    );

    app.get("/create-file", async (req: Request, res: Response) => {
        const dir = `./teste.txt`;
        const r = await createFile(dir, "Start");
        res.send(r);
    });

    app.get("/sendemail", async (req: Request, res: Response) => {
        sendEmail("Helllo Iagooo! :D");
        res.send({});
    });

    app.post("/firebase", async (req: Request, res: Response) => {
        const userController = new UserController();
        // const rcalendar = await userController.removeCalendar('-NjSBwf5QzdkydOpNiyT');
        const a = {
            title: "Agenda de segunda",
            text: "Olá meus contatos de whatsapp",
            userId: "999",
        };
        const calendar = await userController.addCalendar(a);
        res.send(calendar);
    });

    app.delete("/remove-calendar/:key", async (req: Request, res: Response) => {
        const { key } = req.params;
        const userController = new UserController();
        const rcalendar = await userController.removeCalendar(key);
        res.send(rcalendar);
    });

    app.post(
        "/add-calendar",
        verifyToken,
        async (req: Request, res: Response) => {
            const userController = new UserController();
            const calendar = await userController.addCalendar(req.body);
            res.status(200).send({ message: "Agenda salvo com sucesso!", calendar });
        }
    );

    app.get("/get-calendar", verifyToken, async (req: Request, res: Response) => {
        const userController = new UserController();
        const calendar = await userController.getCalendar();
        res.send(calendar);
    });

    app.get("/get-calendar/:key", async (req: Request, res: Response) => {
        const userController = new UserController();
        const { key } = req.params;
        const calendar = await userController.getCalendarByProperty(key);
        res.send(calendar);
    });

    app.get(
        "/send-schedule/:key",
        venomDelsuc.checkClientDefined.bind(venomDelsuc),
        async (req: Request, res: Response) => {
            const userController = new UserController();
            const { key } = req.params;
            const result = await userController.sendSchedule(key, venomDelsuc);
            res.send(result);
        }
    );

    app.post("/register-user", async (req: Request, res: Response) => {
        const userController = new UserController();
        const calendar = await userController.registerUser(req.body);
        res
            .status(200)
            .send({ message: "Usuário cadastrado com sucesso!", calendar });
    });
}
