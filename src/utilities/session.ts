import MongoStore from "connect-mongo";
import { SessionData } from "express-session";

export const getPrevSession = (clientSessionId: string, store: MongoStore) => {
  return new Promise<SessionData>((resolve, reject) => {
    store.get(clientSessionId, (err, session) => {
      if (session) {
        resolve(session);
      } else {
        reject(err);
      }
    });
  });
};
