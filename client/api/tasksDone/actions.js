import API from "../server.js"; // Import the axios instance

// Mark a task as done
export const markTaskAsDone = async (taskDoneData) => {
  try {
    const response = await API.post("/tasks-done", taskDoneData);
    return response.data;
  } catch (error) {
    console.error("Error marking task as done:", error);
    throw error;
  }
};

// Get all tasks done by a specific user
export const getTasksDoneByUser = async (userId) => {
  try {
    const response = await API.get(`/tasks-done/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks done by user:", error);
    throw error;
  }
};
