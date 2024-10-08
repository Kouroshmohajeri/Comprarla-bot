import React, { useEffect, useState } from "react";
import { getUserDetails } from "@/api/users/actions";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "./UserProfile.module.css";
import MyInvitations from "../MyInvitations/MyInvitations";

const UserProfile = () => {
  const router = useSearchParams();
  const userId = router.get("userId");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const userData = await getUserDetails(userId);
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }
  }, [userId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!user) return <p className={styles.notFound}>User not found.</p>;

  // Helper function to get user initials
  const getInitials = (firstName, lastName) => {
    if (!firstName) return "";
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return lastInitial ? `${firstInitial}${lastInitial}` : firstInitial;
  };

  // Helper function to format the date as YYYY/MM/DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  return (
    <>
      <div className={styles.profileBox}>
        <div className={styles.profileHeader}>
          {user.profilePhotoUrl ? (
            <div className={styles.profilePicture}>
              <Image
                src={user.profilePhotoUrl}
                alt={`${user.firstName} ${user.lastName}'s profile`}
                width={100} // Specify the width
                height={100} // Specify the height
                className={styles.profileImage}
              />
            </div>
          ) : (
            <div className={styles.defaultPicture}>
              {getInitials(user.firstName, user.lastName)}
            </div>
          )}
          <h2>
            {user.firstName} {user.lastName ? user.lastName : ""}
          </h2>
        </div>
        <p>
          <strong>Date of Joining:</strong> {formatDate(user.dateJoined)}
        </p>
        <p>
          <strong>Points:</strong> {user.points}
        </p>
        <p>
          <strong>Invitations:</strong> {user.invitations.length}
        </p>
      </div>
      <MyInvitations />
    </>
  );
};

export default UserProfile;
