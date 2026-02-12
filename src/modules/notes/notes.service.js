import { tokenDecodeAndCheck } from "../../common/encrypt/token.js";
import { notesModel } from "../../database/index.js";


export const createNote = async (headers, data) => {
    const { title, content } = data
    const decoded = tokenDecodeAndCheck(headers)

    const note = await notesModel.create({title,content,userId: decoded.id})

    return note
}
