import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';

function TaskForm({ onSubmit, onCancel, initialTask }) {
  const [text, setText] = useState('');

  useEffect(() => {
    // If an initial task is provided (for edit mode), populate the text
    if (initialTask) {
      setText(initialTask.title);
    } else {
      setText('');
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return; // don't submit empty
    onSubmit(text.trim());
    // Clear the form if in add mode
    if (!initialTask) setText('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
      <Stack direction="row" spacing={2}>
        <TextField 
          label={initialTask ? "Edit Task" : "New Task"} 
          placeholder="Enter task..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          fullWidth 
        />
        <Button type="submit" variant="contained" color="primary">
          {initialTask ? "Save" : "Add"}
        </Button>
        {initialTask && 
          <Button type="button" variant="outlined" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        }
      </Stack>
    </form>
  );
}

export default TaskForm;
