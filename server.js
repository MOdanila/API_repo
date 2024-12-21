import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5001;
const prisma = new PrismaClient();

// Define __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/api/notes", async (req, res) => {
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/api/notes", async (req, res) => {
    const { title, description } = req.body;
    if(!title || !description) {
        return res.status(400).send({ error: "Title and description are required" });  
    }
    try {
        const note = await prisma.note.create({
            data: {
                title,
                description
            }
        });
        res.json(note);
    } catch (error) {
        res.status(500).send({ error: "Error creating note" });
    }
});

app.put("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    if(!id || isNaN(parseInt(id))) {
        return res.status(400).send({ error: "Invalid id" });
    }
    try {
        const updatedNote = await prisma.note.update({
            where: {
                id: parseInt(id)
            },
            data: {
                title,
                description
            }
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).send({ error: "Error updating note" });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const { id } = req.params;
    if(!id ||isNaN(parseInt(id))) {
        return res.status(400).send({ error: "Invalid id" });
    }
    try {
        const deletedNote = await prisma.note.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json(deletedNote);
    } catch (error) {
        res.status(500).send({ error: "Error deleting note" });
    }
});

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});