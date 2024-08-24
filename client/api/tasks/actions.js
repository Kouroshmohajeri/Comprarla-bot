import API from "../server.js";

// Function to create a new task
export const createTask = async (taskData) => {
  try {
    const response = await API.post("/tasks/create", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Function to fetch a task by ID
export const getTask = async (taskId) => {
  try {
    const response = await API.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Function to complete a task
export const completeTask = async (taskId, userId) => {
  try {
    const response = await API.post(`/tasks/complete/${taskId}`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};

// Function to fetch all tasks
export const getAllTasks = async () => {
  try {
    const response = await API.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Function to update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await API.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await API.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
