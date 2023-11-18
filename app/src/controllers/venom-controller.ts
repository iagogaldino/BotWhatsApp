import * as venom from 'venom-bot';
import { verifyMessageClient } from '../chatgpt-ia';
import { createOptions } from '../core/config-venom';
import { Contact, Whatsapp } from 'venom-bot';
import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { requestR } from '../request-result';
import { createFile } from '../common/file';
import { sendEmail } from '../common/sendemail';
import { getSessionUser } from '../session-user';

export class VenomController {

    private _client!: Whatsapp;

    constructor() { }

    venomCreateOPENAI() {
        venom.create(createOptions).then(async (client) => {
            this._client = client;
            client.onMessage((message) => {
                console.log('Client message: ', message);
                // client.sendText(message.from, 'Teste');
                verifyMessageClient(message.body).then(res => {
                    console.log('Response OpenAI:', res.choices[0].message.content);
                    const responseOpenAi = res.choices[0].message.content ? res.choices[0].message.content : 'Sem resposta';
                    // client.sendText('557488578851@broadcast', responseOpenAi);
                    client.sendText(message.from, responseOpenAi);
                });
            });
        }).catch((error: any) => {
            console.error('Erro ao criar o cliente Venom:', error);
        });
    }

    venomCreate() {
        const userSessionKey = getSessionUser().user?.key;

        if (!userSessionKey) {
            console.error('Erro userSessionKey');
            return false;
        }

        createOptions.session = userSessionKey;
        venom.create(createOptions).then(async (client) => {
            this._client = client;
            // sendEmail(`New cliente session: ${session}`);  

        }).catch((error: any) => {
            console.error('Erro ao criar o cliente Venom:', error);
        });
    }

    async getContacts(): Promise<Contact[]> {
        const contacts: Contact[] = await this._client.getAllContacts();
        console.log('contacts', contacts);
        return contacts;
    }

    sendMessage(from: string, message: string) {
        const fromContact = `${from}@broadcast`;
        this._client.sendText(fromContact, message);
    }

    base64Qr(base64Qr: any, asciiQR: any, attempts: any, urlCode: any) {
        console.log(asciiQR); // Optional to log the QR in the terminal
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response: any = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        // response.type = matches[1];
        // response.data = new Buffer.from(matches[2], 'base64');

        let imageBuffer = response;
        require('fs').writeFile(
            'out.png',
            imageBuffer['data'],
            'binary',
            function (err: any) {
                if (err != null) {
                    console.log(err);
                }
            }
        );
    }

    sendImageFromBase64(to: string, base64Image: string, imageName: string) {
        this._client
            .sendImageFromBase64(to, base64Image, imageName)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
    }

    /**
     * 
     * @param chatId 000000000000@c.us
     * @param includeMe includeMe will be by default true, if you do not want to pass false
     * @param includeNotifications includeNotifications will be by default true, if you do not want to pass false
     */
    async loadAndGetAllMessagesInChat(chatId: string, includeMe?: boolean | undefined, includeNotifications?: boolean | undefined) {
        const contactId = `${chatId}@c.us`;
        const dir = `./${chatId}-loadAndGetAllMessagesInChat.json`;

        const allMessages = await this._client.loadAndGetAllMessagesInChat(contactId, false, false);
        createFile(dir, JSON.stringify(allMessages));

        return allMessages;
    }

    async loadEarlierMessages(chatId: string, includeMe?: boolean | undefined, includeNotifications?: boolean | undefined) {
        const allMessages = await this._client.loadEarlierMessages(chatId);
        return allMessages;
    }

    async checkNumberStatus(contactId: string) {
        const chat = await this._client
            .checkNumberStatus(contactId)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
        return chat;
    }

    async getAllMessagesInChat(contactId: string) {
        const chatId = `${contactId}@c.us`;
        const dir = `./${chatId}-getAllMessagesInChat.json`;

        const messages = await this._client.getAllMessagesInChat(chatId, true, true);
        createFile(dir, JSON.stringify(messages));

        return requestR(dir);
    }


    // Middleware para verificar se _client está definido
    checkClientDefined(req: Request, res: Response, next: NextFunction) {
        if (!this._client) {
            return res.status(500).send(requestR('O cliente WhatsApp não está definido.', true));
        }
        next();
    }


}




