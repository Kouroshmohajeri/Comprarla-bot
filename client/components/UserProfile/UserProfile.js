import React, { useEffect, useState } from "react";
import { getUserDetails } from "@/api/users/actions";
import { useSearchParams } from "next/navigation";
import styles from "./UserProfile.module.css";

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

  return (
    <div className={styles.profileBox}>
      <div className={styles.profileHeader}>
        {user.profilePhotoUrl ? (
          <img
            src={user.profilePhotoUrl}
            alt={`${user.username}'s profile`}
            className={styles.profilePicture}
          />
        ) : (
          <div className={styles.defaultPicture}>
            {getInitials(user.firstName, user.lastName)}
          </div>
        )}
        <h2>{user.username}</h2>
      </div>
      <p>
        <strong>Date of Joining:</strong>{" "}
        {new Date(user.dateJoined).toLocaleDateString()}
      </p>
      <p>
        <strong>Points:</strong> {user.points}
      </p>
      <p>
        <strong>Invitations:</strong> {user.invitations.length}
      </p>
    </div>
  );
};

export default UserProfile;
