import { Request, Response } from "express";
import { Task, TaskStatus } from "../types/task";

// Dummy data: penyimpanan sementara di memory
let tasks: Task[] = [
  {
    id: 1,
    title: "Belajar Express.js",
    description: "Memahami dasar-dasar Express.js",
    status: "pending",
  },
  {
    id: 2,
    title: "Belajar TypeScript",
    description: "Memahami interface dan type",
    status: "completed",
  },
  {
    id: 3,
    title: "Membuat REST API",
    description: "Menyelesaikan Task Management API",
    status: "pending",
  },
];

let nextId = 4;

// Validasi input tugas
function validateTask(
  title: unknown,
  description: unknown,
  status: unknown
): string | null {
  if (typeof title !== "string" || title.trim() === "") {
    return "Title wajib diisi dan tidak boleh kosong.";
  }

  if (
    typeof description !== "string" ||
    description.trim() === ""
  ) {
    return "Description wajib diisi dan tidak boleh kosong.";
  }

  if (status !== "pending" && status !== "completed") {
    return "Status harus berupa pending atau completed.";
  }

  return null;
}

// GET /tasks
export const getAllTasks = (
  req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    message: "Berhasil mengambil seluruh tugas.",
    data: tasks,
  });
};

// GET /tasks/:id
export const getTaskById = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: "ID tugas harus berupa bilangan bulat positif.",
    });
    return;
  }

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Tugas tidak ditemukan.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Berhasil mengambil detail tugas.",
    data: task,
  });
};

// POST /tasks
export const createTask = (
  req: Request,
  res: Response
): void => {
  const { title, description, status } = req.body;

  const error = validateTask(title, description, status);

  if (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
    return;
  }

  const newTask: Task = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    status: status as TaskStatus,
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Tugas berhasil ditambahkan.",
    data: newTask,
  });
};

// PUT /tasks/:id
export const updateTask = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: "ID tugas harus berupa bilangan bulat positif.",
    });
    return;
  }

  const taskIndex = tasks.findIndex((item) => item.id === id);

  if (taskIndex === -1) {
    res.status(404).json({
      success: false,
      message: "Tugas tidak ditemukan.",
    });
    return;
  }

  const { title, description, status } = req.body;

  const error = validateTask(title, description, status);

  if (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
    return;
  }

  const updatedTask: Task = {
    id,
    title: title.trim(),
    description: description.trim(),
    status: status as TaskStatus,
  };

  tasks[taskIndex] = updatedTask;

  res.status(200).json({
    success: true,
    message: "Tugas berhasil diperbarui.",
    data: updatedTask,
  });
};

// DELETE /tasks/:id
export const deleteTask = (
  req: Request,
  res: Response
): void => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: "ID tugas harus berupa bilangan bulat positif.",
    });
    return;
  }

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Tugas tidak ditemukan.",
    });
    return;
  }

  tasks = tasks.filter((item) => item.id !== id);

  res.status(200).json({
    success: true,
    message: "Tugas berhasil dihapus.",
    data: task,
  });
};