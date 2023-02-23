import { app } from "../../firebase"
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore"
import { GameBoard, gameBoardSchema } from "../lib"
import * as z from "zod"

const db = getFirestore(app)

const PATH = "app"
const BOARD = "board"

const sotrageSchema = z.object({
  app: z.string()
})
type Storage = z.infer<typeof sotrageSchema>

export const subscribe = (cb: (board: GameBoard) => void) => {
  const unsubscribe = onSnapshot( doc(db, PATH, BOARD), (doc) => {
    const d = doc.data()

    if(!sotrageSchema.safeParse(d).success){
      return
    }

    try{
      const board = JSON.parse((d as Storage).app)
      if(!gameBoardSchema.safeParse(board).success){
        return
      }

      cb(board)
    }catch(e){
      console.log({e})
    }
  })

  return unsubscribe
}

export const saveBoard = (board: GameBoard) => {
  const ref = doc(db, PATH, BOARD)
  setDoc(ref, {
    app: JSON.stringify(board)
  })
}