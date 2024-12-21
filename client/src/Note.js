import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/notes');
                setNotes(response.data);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };
        fetchNotes();
    }, []);
    const addNote = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/notes', {
                title,
                description
            });
            setNotes([...notes, response.data]);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };
    const deleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/notes/${id}`);
            const newNotes = notes.filter((note) => note._id !== id);
            setNotes(newNotes);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };
    const editNote = async (id) => {
        try {
            const response = await axios.put(`http://localhost:5001/api/notes/${id}`, {
                title,
                description
            });
            const newNotes = notes.map((note) => {
                if (note._id === id) {
                    return response.data;
                }
                return note;
            });
            setNotes(newNotes);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error editing note:', error);
        }
    };
    return (
        <div>
            <h1>Notes</h1>
            <ul>
                {notes.map((note) => (
                    <li key={note._id}>
                        <h2>{note.title}</h2>
                        <p>{note.description}</p>
                        <button onClick={() => deleteNote(note._id)}>Delete</button>
                        <button onClick={() => editNote(note._id)}>Edit</button>
                    </li>
                ))}
            </ul>
            <h2>Add Note</h2>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="Description" value={description} onChange={(e) =>
                setDescription(e.target.value)
            } />
            <button onClick={addNote}>Add</button>
        </div>
    );
}

export default Notes;