require('dotenv').config(); 
const express = require('express');
const app = express();

app.use(express.json());

let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build a CRUD API', completed: true },
];

app.get('/todos', (req, res) => {
    res.status(200).json(todos); //send array as json
});

app.get('/todos/active', (req,res) => {
    const activeTodos = todos.filter((t) => t.completed === false);
    res.status(200).json(activeTodos);
});

app.get('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(todo);
});



app.post('/todos', (req, res) => {
    if (!req.body.task || typeof req.body.task !== 'string' || req.body.task.trim() === '') {
        return res.status(400).json({ error: 'Validation: POST requires "task" field.' });
    }

    const newTodo = { id: todos.length + 1, ...req.body }; //Auto-ID
    todos.push(newTodo);
    res.status(201).json(newTodo); //send new todo as json
});

//Patch Update - partial
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    Object.assign(todo, req.body); //merge: e.g. {completed: true} into existing todo
    res.status(200).json(todo); 
});

    //Delete Remove
    app.delete('/todos/:id', (req,res) => {
        const id = parseInt(req.params.id);
        const initialLength = todos.length;
        todos = todos.filter((t) => t.id !== id); //Array.filter() -Nondestructive
        if (todos.length === initialLength)
            return res.status(404).json({ error: 'Not found'});
        res.status(204).send(); // Silent success
    });

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server error'});
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})