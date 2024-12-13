"use client";
import React, { useEffect, useState } from "react";
import { getUserDetails, generateInvitationCode } from "@/api/users/actions.js";
import SideMenu from "../SideMenu/SideMenu";
import ParticlesBackground from "../ParticlesBackground/ParticlesBackground";
import styles from "./DashboardPage.module.css";
import Modal from "../Modal/Modal"; // Import the Modal component
import LoadingData from "../LoadingData/LoadingData";

const DashboardPage = () => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [invitationCode, setInvitationCode] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // Track active modal

  useEffect(() => {
    const userIdCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];

    if (userIdCookie) {
      setUserId(userIdCookie);

      getUserDetails(userIdCookie)
        .then((data) => {
          setUserDetails(data);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });

      generateInvitationCode(userIdCookie)
        .then((data) => {
          setInvitationCode(data.invitationCode);
        })
        .catch((error) => {
          console.error("Error generating invitation code:", error);
        });
    }
  }, []);
  const handleGenerateInvitation = async () => {
    try {
      const invitationLink = `https://t.me/comprarlabot?start=${invitationCode}`;
      const message = `Hi there! Let's join Comprarla✨️

First ever online shop with a Telegram mini app!

Join now with the link below and earn 100 points and 50 extra points as a bonus🤩

Join here👇🏼
${invitationLink}

Also, join our channel for the latest news💡
https://t.me/comprarla`;

      // Send the message via Telegram
      window.Telegram.WebApp.close();
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          invitationLink
        )}&text=${encodeURIComponent(message)}`
      );
      alert(invitationLink);
    } catch (error) {
      console.error("Failed to generate invitation code:", error);
    }
  };
  const handleBoxClick = (boxName) => {
    setActiveModal(boxName); // Set the modal to open
  };

  const closeModal = () => {
    setActiveModal(null); // Close the modal
  };

  return (
    <div>
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <div
        className={`${styles.dashboardContainer} ${
          isMenuOpen ? "" : styles.menuClosed
        }`}
      >
        {userDetails ? (
          <div className={styles.gridContainer}>
            {/* Box 1: User Details */}
            <div
              className={styles.box}
              onClick={() => handleBoxClick("userDetails")}
            >
              <h2>User Details</h2>
              <p>
                Name: {userDetails.firstName}{" "}
                {userDetails.lastName ? userDetails.lastName : ""}
              </p>
              {userDetails.username && <p>Username: {userDetails.username}</p>}
              <p>
                Date Joined:{" "}
                {new Date(userDetails.dateJoined).toLocaleDateString()}
              </p>
            </div>

            {/* Box 2: User Points */}
            <div
              className={styles.box}
              onClick={() => handleBoxClick("points")}
            >
              <h2>User Points</h2>
              <p>{userDetails.points}</p>
            </div>

            {/* Box 3: Tasks Done */}
            <div className={styles.box} onClick={() => handleBoxClick("tasks")}>
              <h2>Tasks Done</h2>
              <p>{userDetails.tasksDone}/1</p>
            </div>

            {/* Box 4: Invitation Code / Invite Button */}
            <div
              className={styles.box}
              onClick={() => handleBoxClick("invite")}
            >
              <h2>Invite</h2>
              {invitationCode && (
                <button
                  onClick={handleGenerateInvitation}
                  className={styles.inviteButton}
                >
                  Invite friendss
                </button>
              )}
            </div>
          </div>
        ) : (
          // <h1 className={styles.loading}>Loading user data...</h1>
          <LoadingData />
        )}
      </div>
      <ParticlesBackground id="particles" />

      {/* Modal Implementation */}
      {activeModal && (
        <Modal onClose={closeModal}>
          {activeModal === "userDetails" && (
            <div>
              <h2>User Details</h2>
              <p>
                Name: {userDetails.firstName}{" "}
                {userDetails.lastName ? userDetails.lastName : ""}
              </p>
              {userDetails.username && <p>Username: {userDetails.username}</p>}
              <p>
                Date Joined:{" "}
                {new Date(userDetails.dateJoined).toLocaleDateString()}
              </p>
            </div>
          )}
          {activeModal === "points" && (
            <div>
              <h2>User Points</h2>
              <p>{userDetails.points}</p>
            </div>
          )}
          {activeModal === "tasks" && (
            <div>
              <h2>Tasks Done</h2>
              <p>{userDetails.tasksDone}/1</p>
            </div>
          )}
          {activeModal === "invite" && (
            <div>
              <h2>Invite</h2>
              {invitationCode && (
                <button
                  onClick={handleGenerateInvitation}
                  className={styles.inviteButton}
                >
                  Invite friends
                </button>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
