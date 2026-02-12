import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.ObjectId,
            ref: "users",
            required: true
        }
    },
    {
        timestamps: true,
        collection: "notes"    
    }
);

export const notesModel = mongoose.model("notes", notesSchema);
