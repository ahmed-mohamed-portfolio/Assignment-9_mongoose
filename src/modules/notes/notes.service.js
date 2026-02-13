import { tokenDecodeAndCheck } from "../../common/encrypt/token.js";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../common/utils/responce/error.responce.js";
import { notesModel } from "../../database/index.js";
import mongoose from "mongoose";


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



export const updateAllNotesTitle = async (headers, data) => {

    const { title } = data
    if (!title) {
        return BadRequestException({ message: "title is required" })
    }


    const decoded = tokenDecodeAndCheck(headers)


    const updateResult = await notesModel.updateMany(
        { userId: decoded.id },
        { $set: { title } },
        { runValidators: true }
    )


    if (updateResult.matchedCount === 0) {
        return NotFoundException({ message: "No note found" })
    }


    return { message: "All notes updated" }

}


export const deleteNote = async (headers, noteId) => {
    const decoded = tokenDecodeAndCheck(headers)

    const note = await notesModel.findById(noteId)
    if (!note) {
        return NotFoundException({ message: "Note not found" })
    }

    if (decoded.id !== note.userId.toString()) {
        return UnauthorizedException({ message: "You are not the owner" })
    }

    const deletedNote = await notesModel.findByIdAndDelete(noteId)

    return { message: "deleted", note: deletedNote }
}


export const deleteAllNotes = async (headers) => {
    const decoded = tokenDecodeAndCheck(headers)

    await notesModel.deleteMany({ userId: decoded.id })

    return { message: "Deleted" }
}


export const getPaginatedNotesSort = async (headers, query) => {
    const decoded = tokenDecodeAndCheck(headers)

    const page = query.page 
    const limit = query.limit


    if (isNaN(limit) || isNaN(page) || page < 1 || limit < 1) {
        return BadRequestException({ message: "page and limit must be positive numbers" })
    }

    const skip = (page - 1) * limit

    const notes = await notesModel
        .find({ userId: decoded.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    return notes
}


export const getNoteById = async (headers, noteId) => {

    const decoded = tokenDecodeAndCheck(headers)

    const note = await notesModel.findById(noteId)
    if (note) {

        if (decoded.id !== note.userId.toString()) {
            return UnauthorizedException({ message: "You are not the owner" })
        }

        return note

    }

    return NotFoundException({ message: "Note not found" })

}


export const getNoteByContent = async (headers, query) => {

    const decoded = tokenDecodeAndCheck(headers)

    const content = query.content

    if (!content) {
        return BadRequestException({ message: "content is required" })
    }

    const note = await notesModel.findOne({
        userId: decoded.id,
        content: content
    })

    if (!note) {
        return NotFoundException({ message: "No note found" })
    }

    return note
}


export const getNotesWithUser = async (headers) => {
    const decoded = tokenDecodeAndCheck(headers)

    const notes = await notesModel
        .find({ userId: decoded.id })
        .select("title userId createdAt")
        .populate({ path: "userId", select: "email -_id" })

    return notes
}


export const aggregateNotesWithUser = async (headers, query) => {

    const decoded = tokenDecodeAndCheck(headers)

    const title = query.title

    if (!title) {
        return BadRequestException({ message: "title is required" })
    }


    const notes = await notesModel.aggregate([
        { $match: {userId: new mongoose.Types.ObjectId(decoded.id) , title:title} },
        {
            $lookup: {
                from: "users",         // The foreign collection name
                localField: "userId",  // Field in the local 'notes' collection
                foreignField: "_id",   // Field in the foreign 'users' collection
                as: "user"             // New field to store matched author documents
            }
        },
        { $unwind: "$user" }, // Optional: Deconstruct the array field for a single object
        {
            $project: {
                title: 1,
                userId: 1,
                createdAt: 1,
                user: {
                    name: "$user.name",
                    email: "$user.email"
                }
            }
        }
    ])

    
    return notes
}
