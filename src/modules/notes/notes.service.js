import { tokenDecodeAndCheck } from "../../common/encrypt/token.js";
import { notesModel } from "../../database/index.js";


export const createNote = async (headers, data) => {
    const { title, content } = data

    const decoded = tokenDecodeAndCheck(headers)

    const note = await notesModel.create({ title, content, userId: decoded.id })

    return note
}


export const updateNote = async (headers, data, noteId) => {

    const { title, content } = data


    const getNote = await notesModel.findById(noteId)
    if (getNote) {

        const decoded = tokenDecodeAndCheck(headers)
        if (decoded.id !== getNote.userId.toString()) {

            return { message: "you are not the owner" }
        }


        try {
            const note = await notesModel.findByIdAndUpdate(noteId, { title, content },  { new: true})
            return note

        } catch (error) {
            return error

        }


    }

    return { message: "note not found" }

}
