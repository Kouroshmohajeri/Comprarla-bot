import React, { useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { getAllTasks } from "@/api/tasks/actions.js"; // Function to fetch all tasks
import { getTasksDoneByUser, markTaskAsDone } from "@/api/tasksDone/actions.js"; // Functions to fetch tasks done by user and mark a task as done
import { getUserDetails, updateUserDetails } from "@/api/users/actions.js"; // Functions to fetch and update user details
import { useSearchParams, useRouter } from "next/navigation"; // For getting the userId from URL parameters and redirecting
import styles from "./Tasks.module.css"; // Import the CSS module
import Alert from "@/components/Alert/Alert.js"; // Import the Alert component

const LOCAL_STORAGE_KEY = "task_state"; // Key for local storage

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [taskToClaim, setTaskToClaim] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(null); // State for managing alert

  const searchParams = useSearchParams();
  const router = useRouter(); // For redirection
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch all tasks
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);

        // Fetch completed tasks by the user
        if (userId) {
          const doneTasks = await getTasksDoneByUser(userId);
          const doneTaskIds = doneTasks.map((task) => task.taskId._id); // Extract task IDs
          setCompletedTasks(doneTaskIds);

          // Fetch user details to get current points
          const userDetails = await getUserDetails(userId);
          setUserPoints(userDetails.points);
        }
      } catch (error) {
        console.error("Error fetching tasks or completed tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  useEffect(() => {
    // Check local storage for any tasks to claim
    const storedTask = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTask) {
      const { taskId } = JSON.parse(storedTask);
      const task = tasks.find((task) => task._id === taskId);
      if (task) {
        setTaskToClaim(task); // Set task to claim
      }
    }
  }, [tasks]);

  const handleStartClick = async (taskId) => {
    try {
      setButtonDisabled(true);
      await markTaskAsDone({ userId, taskId });

      // Store the task ID in local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ taskId }));

      // Redirect to the task link
      const task = tasks.find((task) => task._id === taskId);
      if (task?.link) {
        router.push(task.link);
      }

      // Disable the button for 5 seconds, then re-enable
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);
    } catch (error) {
      console.error("Error marking task as done:", error);
      setButtonDisabled(false); // Re-enable button in case of error
    }
  };

  const handleClaimClick = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      const newPoints = userPoints + task.points;

      await updateUserDetails(userId, { points: newPoints });
      setUserPoints(newPoints); // Update user's points in the state
      setCompletedTasks([...completedTasks, taskId]); // Mark task as completed
      setTaskToClaim(null); // Reset the task to claim

      // Clear local storage for this task
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      // Show alert for claiming points
      setAlert({
        message: `Points claimed successfully! You have earned ${task.points} points.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error claiming points:", error);
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div className={styles.container}>
      <h1>Tasks</h1>
      <hr className={styles.divider} />
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task._id} className={styles.taskItem}>
            <div className={styles.taskInfo}>
              {task.icon === "instagram" && (
                <InstagramIcon className={styles.taskIcon} fontSize="large" />
              )}
              <span>{task.title}</span>
            </div>
            {!completedTasks.includes(task._id) ? (
              <button
                onClick={() => handleStartClick(task._id)}
                disabled={buttonDisabled}
                className={`${styles.taskButton} ${styles.taskButtonStart}`}
              >
                Start
              </button>
            ) : taskToClaim?._id === task._id ? (
              <button
                onClick={() => handleClaimClick(task._id)}
                className={`${styles.taskButton} ${styles.taskButtonClaim}`}
              >
                Claim
              </button>
            ) : (
              <span
                className={`${styles.taskButton} ${styles.taskButtonCompleted}`}
              >
                Completed
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Alert component */}
      <Alert
        message={alert?.message}
        type={alert?.type}
        onClose={() => setAlert(null)}
      />
    </div>
  );
};

export default Tasks;
