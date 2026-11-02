import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Middleware untuk membaca request body berformat JSON
app.use(express.json());

// Dummy data sederhana untuk simulasi database
let tasks = [
  { id: 1, title: "Belajar Express.js", completed: false },
  { id: 2, title: "Belajar TypeScript", completed: true },
];

// 1. GET /tasks - Mendapatkan semua daftar task
app.get("/tasks", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Berhasil mendapatkan semua data task",
    data: tasks,
  });
});

// 2. GET /tasks/:id - Mendapatkan task berdasarkan ID
app.get("/tasks/:id", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id as string);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task tidak ditemukan" });
  }

  res.status(200).json({
    message: "Berhasil mendapatkan task",
    data: task,
  });
});

// 3. POST /tasks - Menambahkan task baru
app.post("/tasks", (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title wajib diisi" });
  }

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task berhasil ditambahkan",
    data: newTask,
  });
});

// 4. PUT /tasks/:id - Mengubah/memperbarui task berdasarkan ID
app.put("/tasks/:id", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id as string);
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task tidak ditemukan" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
  };

  res.status(200).json({
    message: `Task dengan ID ${taskId} berhasil diperbarui`,
    data: tasks[taskIndex],
  });
});

// 5. DELETE /tasks/:id - Menghapus task berdasarkan ID
app.delete("/tasks/:id", (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id as string);
  const initialLength = tasks.length;

  tasks = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === initialLength) {
    return res.status(404).json({ message: "Task tidak ditemukan" });
  }

  res.status(200).json({
    message: `Task dengan ID ${taskId} berhasil dihapus`,
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
