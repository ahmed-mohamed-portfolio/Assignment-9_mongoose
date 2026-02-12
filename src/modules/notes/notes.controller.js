import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import { createNote } from "./notes.service.js";

const router = Router()

router.post('/', async (req, res) => {
    await createNote(req.headers, req.body)
    return SuccessResponse({ res, message: "Note created", status: 201 })
})



export default router
