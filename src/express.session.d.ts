import { User } from './users/users.service';

declare module 'express-session' {
  interface SessionData {
    // ОН НЕ МОЖЕТ СОХРАНИТЬ ПРОСТО АЙДИШНИК, ПОТОМУ ЧТО ЭТО НЕ СЕРИАЛИЗУЕТСЯ
    // ТАК ЧТО ЛУЧШЕ ЗАПИХИВАЙ ОБЪЕКТ ЦЕЛИКОМ ИЛИ ЗАПИХИВАЙ user = { id: '123' }
    user?: User;
  }
}

// ts hack, do not remove
export {};
