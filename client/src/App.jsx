import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get("http://localhost:5000/notes");
    setNotes(response.data);
  };

  const createNote = async () => {
    const response = await axios.post("http://localhost:5000/notes", {
      title,
      content,
    });
    setNotes([...notes, response.data]);
    setTitle("");
    setContent("");
  };

  const updateNote = async (id) => {
    const response = await axios.put(`http://localhost:5000/notes/${id}`, {
      title,
      content,
    });
    setNotes(notes.map((note) => (note._id === id ? response.data : note)));
    setTitle("");
    setContent("");
    setEditing(null);
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    setNotes(notes.filter((note) => note._id !== id));
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditing(note._id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateNote(editing);
    } else {
      createNote();
    }
  };

  return (
    <div>
      <h1>Note App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">{editing ? "Update Note" : "Create Note"}</button>
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button onClick={() => editNote(note)}>Edit</button>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
