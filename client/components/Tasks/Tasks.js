import React, { useState } from "react";
import InstagramIcon from "@mui/icons-material/Instagram"; // Import Instagram icon
import styles from "./Tasks.module.css"; // Import the CSS module

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      _id: "sample-task-id",
      title: "Follow Comprarla on Instagram",
      link: "https://instagram.com/comprarlastore",
      points: 100,
      isTaskDone: false,
    },
  ]);

  const handleCompleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, isTaskDone: true } : task
      )
    );
  };

  return (
    <div className={styles.container}>
      <h1>Tasks</h1>
      <hr className={styles.divider} />
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li key={task._id} className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <InstagramIcon className={styles.taskIcon} fontSize="large" />
              <span>{task.title}</span>
            </div>
            <button
              onClick={() => window.open(task.link, "_blank")}
              disabled={task.isTaskDone}
              className={
                task.isTaskDone
                  ? `${styles.taskButton} ${styles.taskButtonDisabled}`
                  : styles.taskButton
              }
            >
              {task.isTaskDone ? "Completed" : "start"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
