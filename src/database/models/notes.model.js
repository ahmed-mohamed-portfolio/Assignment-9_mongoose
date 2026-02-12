import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            //refrance:: https://mongoosejs.com/docs/validation.html
            validate: {
                validator: function (v) {
                    return !/^[A-Z\s]+$/.test(v);
                },
                message: props => `${props.value} can not be entirely upperCase`
            },
        },
        content: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // the clearer/canonical form
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
