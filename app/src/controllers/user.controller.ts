import * as jwt from 'jsonwebtoken';
import { getDB, getOnlyItem, removeItem, searchByProperty, writeUserData } from "../database/firebase";
import { SECRETKEY } from "../middleware/middlewareJWT";
import { calendarM } from "../modules/calendar";
import { User } from "../modules/user";
import { EXPIRESIN, getSessionUser } from '../session-user';
import { VenomController } from "./venom-controller";
import { DBcollection } from '../models/enums/db-collections';

export class UserController {

    async addCalendar(params: any) {
        const calendar = calendarM(params);
        const path = `${DBcollection.USERS}/${getSessionUser().user.key}/${DBcollection.CANLEDAR}/`;
        return writeUserData(path, calendar);
    }

    async getCalendar(): Promise<void> {
        const path = `${DBcollection.USERS}/${getSessionUser().user.key}/${DBcollection.CANLEDAR}/`;
        return await getDB(path);
    }

    async removeCalendar(key: string): Promise<any> {
        if (!key) {
            const err = { error: 'Error key null' };
            return err;
        }
        const path = `${DBcollection.USERS}/${getSessionUser().user.key}/${DBcollection.CANLEDAR}/`;
        return await removeItem(path, key);
    }

    async getCalendarByProperty(value: string): Promise<any> {
        const userId = '999';
        const path = `${DBcollection.USERS}/${getSessionUser().user.key}/${DBcollection.CANLEDAR}/`;
        return await searchByProperty(path, userId, value);
    }

    async sendSchedule(key: string, venomDelsuc: VenomController): Promise<any> {
        const path = `${DBcollection.USERS}/${getSessionUser().user.key}/${DBcollection.CANLEDAR}/`;
        const schedule = await getOnlyItem(`${path}/${key}`);
        const { text } = schedule;
        const concactsSend: any = [];
        schedule?.contacts?.forEach((contact: any) => {
            const phone = contact.id.user;
            venomDelsuc.sendMessage(phone, text);
            concactsSend.push(phone);
        });

        return concactsSend;
    }

    async registerUser(params: any): Promise<any> {
        const userdata = User(params);
        const keyUser = writeUserData('users/', userdata);
        return keyUser;
    }

    async login(phone: number, pass: string) {
        const result: any[] = await searchByProperty('users', 'phone', `${phone}`);
        const user = result.find((usr: any) => usr.value.pass == pass);
        if (user?.key) {

            const { name, phone } = user.value;
            const userdata = { key: user.key, name, phone }
            const token = jwt.sign({ user: userdata }, SECRETKEY, { expiresIn: EXPIRESIN });

            return { userdata, token };
        }
        return false;
    }

}
