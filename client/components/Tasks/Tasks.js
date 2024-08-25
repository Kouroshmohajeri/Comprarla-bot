import React, { useEffect, useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import { FaDiscord, FaYoutube, FaPinterestP } from "react-icons/fa";
import { BsTelegram, BsTwitterX } from "react-icons/bs";
import LanguageIcon from "@mui/icons-material/Language";

import { getAllTasks } from "@/api/tasks/actions.js";
import { getTasksDoneByUser, markTaskAsDone } from "@/api/tasksDone/actions.js";
import { getUserDetails, updateUserDetails } from "@/api/users/actions.js";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./Tasks.module.css";
import Alert from "@/components/Alert/Alert.js";

const LOCAL_STORAGE_KEY = "task_state";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [taskToClaim, setTaskToClaim] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks();
        setTasks(fetchedTasks);

        if (userId) {
          const doneTasks = await getTasksDoneByUser(userId);
          const doneTaskIds = doneTasks.map((task) => task.taskId._id);
          setCompletedTasks(doneTaskIds);

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
    const storedTask = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTask) {
      const { taskId } = JSON.parse(storedTask);
      const task = tasks.find((task) => task._id === taskId);
      if (task) {
        setTaskToClaim(task);
      }
    }
  }, [tasks]);

  const handleStartClick = async (taskId) => {
    try {
      setButtonDisabled(true);
      await markTaskAsDone({ userId, taskId });

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ taskId }));

      const task = tasks.find((task) => task._id === taskId);

      if (task?.link) {
        window.open(task.link, "_blank");
      }

      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);

      setAlert({
        message:
          "Task marked as done. Please return and click 'Claim' to earn points.",
        type: "info",
      });
    } catch (error) {
      console.error("Error marking task as done:", error);
      setButtonDisabled(false);
    }
  };

  const handleClaimClick = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      const newPoints = userPoints + task.points;

      await updateUserDetails(userId, { points: newPoints });
      setUserPoints(newPoints);
      setCompletedTasks([...completedTasks, taskId]);
      setTaskToClaim(null);

      localStorage.removeItem(LOCAL_STORAGE_KEY);

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
              {/* Render the appropriate icon */}
              {task.icon === "instagram" && (
                <InstagramIcon className={styles.taskIcon} fontSize="large" />
              )}
              {task.icon === "discord" && (
                <FaDiscord
                  className={styles.taskIcon}
                  size={"5vh"}
                  color="#5462EB"
                />
              )}
              {task.icon === "twitter" && (
                <BsTwitterX className={styles.taskIcon} size={"5vh"} />
              )}
              {task.icon === "channel" && (
                <BsTelegram
                  className={styles.taskIcon}
                  size={"5vh"}
                  color="#34AAE2"
                />
              )}
              {task.icon === "youtube" && (
                <FaYoutube
                  className={styles.taskIcon}
                  size={"5vh"}
                  color="#FF0000"
                />
              )}
              {task.icon === "website" && (
                <LanguageIcon className={styles.taskIcon} fontSize="large" />
              )}
              {task.icon === "pinterest" && (
                <FaPinterestP
                  className={styles.taskIcon}
                  size={"5vh"}
                  color="#C41F26"
                />
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
