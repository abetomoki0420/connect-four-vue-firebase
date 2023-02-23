import { app } from "../../firebase";
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { GameBoard, gameBoardSchema, gameStatusSchema } from "../lib";
import * as z from "zod";

const db = getFirestore(app);

const PATH = "app";
const BOARD = "board";

const storageBoardSchema = z.object({
  app: z.string(),
});
type StorageBoard = z.infer<typeof storageBoardSchema>;

export const subscribeBoard = (cb: (board: GameBoard) => void) => {
  const unsubscribe = onSnapshot(doc(db, PATH, BOARD), (doc) => {
    const d = doc.data();

    if (!storageBoardSchema.safeParse(d).success) {
      return;
    }

    try {
      const board = JSON.parse((d as StorageBoard).app);
      if (!gameBoardSchema.safeParse(board).success) {
        return;
      }

      cb(board);
    } catch (e) {
      console.log({ e });
    }
  });

  return unsubscribe;
};

export const saveBoard = (board: GameBoard) => {
  const ref = doc(db, PATH, BOARD);
  setDoc(ref, {
    app: JSON.stringify(board),
  });
};

const STATUS = "status";

const storageStatusSchema = gameStatusSchema;
type StorageStatus = z.infer<typeof storageStatusSchema>;

export const subscribeStatus = (cb: (status: StorageStatus) => void) => {
  const unsubscribe = onSnapshot(doc(db, PATH, STATUS), (doc) => {
    const data = doc.data();

    if (storageStatusSchema.safeParse(data).success) {
      cb(data as StorageStatus);
    } else {
      cb({
        turn: true,
        waiting: false,
        started: false,
      });
    }
  });

  return unsubscribe;
};

export const saveStatus = async (status: StorageStatus) => {
  const ref = doc(db, PATH, STATUS);
  await setDoc(ref, status);
};
