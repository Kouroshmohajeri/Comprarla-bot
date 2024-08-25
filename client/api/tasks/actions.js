import API from "../server.js"; // Import the axios instance

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await API.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Get all tasks
export const getAllTasks = async () => {
  try {
    const response = await API.get("/tasks/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await API.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Update a task by ID
export const updateTask = async (taskId, updatedData) => {
  try {
    const response = await API.put(`/tasks/${taskId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task by ID
export const deleteTask = async (taskId) => {
  try {
    const response = await API.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
