import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // import the css file here

function App() {
  const [inputValue, setInputValue] = useState('');
  const [storedValues, setStoredValues] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchValues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inputs');
      setStoredValues(response.data);
    } catch (err) {
      console.error('Error fetching stored values:', err);
    }
  };

  useEffect(() => {
    fetchValues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // update existing
        await axios.put(`http://localhost:5000/api/inputs/${editId}`, {
          value: inputValue,
        });
        setEditId(null);
      } else {
        // add new
        await axios.post('http://localhost:5000/api/submit', { value: inputValue });
      }
      setInputValue('');
      fetchValues();
    } catch (err) {
      alert('Error submitting data.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inputs/${id}`);
      fetchValues();
    } catch (err) {
      alert('Error deleting data.');
    }
  };

  const handleEdit = (item) => {
    setInputValue(item.value);
    setEditId(item._id);
  };

  return (
    <div className="app-container">
      <h1>Simple Input Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter something"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <br /><br />
        <button type="submit">{editId ? 'Update' : 'Submit'}</button>
      </form>

      <h2>Stored Values:</h2>
      <ul>
        {storedValues.length === 0 ? (
          <li>No stored values yet.</li>
        ) : (
          storedValues.map((item) => (
            <li key={item._id}>
              {item.value}
              <span>
                <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
