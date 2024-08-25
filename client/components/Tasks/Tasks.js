import React, { useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { getAllTasks } from "@/api/tasks/actions.js"; // Function to fetch all tasks
import { getTasksDoneByUser, markTaskAsDone } from "@/api/tasksDone/actions.js"; // Functions to fetch tasks done by user and mark a task as done
import { getUserDetails, updateUserDetails } from "@/api/users/actions.js"; // Functions to fetch and update user details
import { useSearchParams, useRouter } from "next/navigation"; // For getting the userId from URL parameters and for redirection
import styles from "./Tasks.module.css"; // Import the CSS module
import Alert from "@/components/Alert/Alert.js"; // Import the Alert component

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [taskToClaim, setTaskToClaim] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(null); // State for managing alert

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const router = useRouter(); // Hook for redirection

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

  const handleStartClick = async (taskId) => {
    try {
      setButtonDisabled(true);
      await markTaskAsDone({ userId, taskId });
      setCompletedTasks([...completedTasks, taskId]); // Add task to completed list
      const task = tasks.find((task) => task._id === taskId);
      setTaskToClaim(task); // Store the task to allow claiming points

      // Redirect to the task link
      if (task?.link) {
        router.push(task.link);
      }

      // Disable the button for 5 seconds, then re-enable
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);

      // Show alert for task completion
      setAlert({
        message: "Task marked as done. Please wait 5 seconds before claiming.",
        type: "info",
      });
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
      setTaskToClaim(null); // Reset the task to claim

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
            <button
              onClick={() => {
                if (!completedTasks.includes(task._id)) {
                  handleStartClick(task._id);
                } else if (taskToClaim?._id === task._id) {
                  handleClaimClick(task._id);
                }
              }}
              disabled={buttonDisabled && !completedTasks.includes(task._id)}
              className={
                completedTasks.includes(task._id) &&
                taskToClaim?._id === task._id
                  ? `${styles.taskButton} ${styles.taskButtonClaim}`
                  : !completedTasks.includes(task._id)
                  ? `${styles.taskButton} ${styles.taskButtonStart}`
                  : `${styles.taskButton} ${styles.taskButtonCompleted}`
              }
            >
              {completedTasks.includes(task._id)
                ? taskToClaim?._id === task._id
                  ? "Claim"
                  : "Completed"
                : "Start"}
            </button>
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
