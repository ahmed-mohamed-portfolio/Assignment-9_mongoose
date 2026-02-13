import { tokenDecodeAndCheck } from "../../common/encrypt/token.js";
import { NotFoundException, UnauthorizedException } from "../../common/utils/responce/error.responce.js";
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
            return UnauthorizedException({ message: "you are not the owner" })
        }

        try {
            const note = await notesModel.findByIdAndUpdate(noteId, { title, content }, { new: true })
            return note
        } catch (error) {
            return error
        }

    }

    return NotFoundException({ message: "note not found" })

}


export const replaceNote = async (headers, data, noteId) => {

    const { title, content } = data

    const decoded = tokenDecodeAndCheck(headers)

    const note = await notesModel.findById(noteId)
    if (!note) {
        return NotFoundException({ message: "note not found" })
    }

    if (decoded.id !== note.userId.toString()) {
        return UnauthorizedException({ message: "you are not the owner" })
    }

    const replacedNote = await notesModel.findOneAndReplace(
        { _id: noteId },
        { title, content, userId: decoded.id },
        { new: true, runValidators: true }
    )

    return replacedNote
}
