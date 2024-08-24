// src/components/MyInvitations.js

import React, { useEffect, useState } from "react";
import { getUserDetails, generateInvitationCode } from "@/api/users/actions.js";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./MyInvitations.module.css";

const MyInvitations = () => {
  const router = useSearchParams();
  const userId = router.get("userId");
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchInvitations = async () => {
        try {
          const userData = await getUserDetails(userId);
          setInvitations(userData.invitations);
        } catch (error) {
          console.error("Failed to fetch user invitations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchInvitations();
    }
  }, [userId]);

  const handleGenerateInvitation = async () => {
    try {
      const response = await generateInvitationCode(userId);
      console.log(response);
      const invitationCode = response.invitationCode;
      const invitationLink = `https://t.me/comprarla/start?invitationCode=${invitationCode}`;
      const message = `Hi! Join me on Comprarla store using my invitation link and earn 50 points using this link along with 100 points for new users! ${invitationLink}`;

      // Minimize the WebApp and show the message dialog
      window.Telegram.WebApp.close();
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(
          invitationLink
        )}&text=${encodeURIComponent(message)}`
      );
    } catch (error) {
      console.error("Failed to generate invitation code:", error);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (invitations.length === 0)
    return (
      <div className={styles.noInvitationContainer}>
        <p className={styles.noInvitations}>No invitations found.</p>
        <div className={styles.inviteButtonContainer}>
          <button
            onClick={handleGenerateInvitation}
            className={styles.generateButton}
          >
            Generate Invitation Code
          </button>
        </div>
      </div>
    );

  return (
    <div className={styles.invitationsContainer}>
      <h3>My Invitations</h3>
      <ul className={styles.invitationsList}>
        {invitations.map((inviteeId) => (
          <InvitationItem key={inviteeId} inviteeId={inviteeId} />
        ))}
      </ul>
      <div className={styles.inviteButtonContainer}>
        <button
          onClick={handleGenerateInvitation}
          className={styles.generateButton}
        >
          Generate Invitation Code
        </button>
      </div>
    </div>
  );
};

const InvitationItem = ({ inviteeId }) => {
  const [invitee, setInvitee] = useState(null);

  useEffect(() => {
    const fetchInviteeDetails = async () => {
      try {
        const inviteeData = await getUserDetails(inviteeId);
        setInvitee(inviteeData);
      } catch (error) {
        console.error(
          `Failed to fetch details for invitee ${inviteeId}:`,
          error
        );
      }
    };

    fetchInviteeDetails();
  }, [inviteeId]);

  if (!invitee) return null;

  const getInitials = (firstName, lastName) => {
    if (!firstName) return "";
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  return (
    <li className={styles.invitationItem}>
      {invitee.profilePhotoUrl ? (
        <Image
          src={invitee.profilePhotoUrl}
          alt={`${invitee.firstName} ${invitee.lastName}'s profile`}
          width={50} // Specify a small size for the image
          height={50} // Specify a small size for the image
          className={styles.inviteeImage}
        />
      ) : (
        <div className={styles.defaultInviteePicture}>
          {getInitials(invitee.firstName, invitee.lastName)}
        </div>
      )}
      <span className={styles.inviteeName}>
        {invitee.firstName} {invitee.lastName ? invitee.lastName : ""}
      </span>
    </li>
  );
};

export default MyInvitations;
