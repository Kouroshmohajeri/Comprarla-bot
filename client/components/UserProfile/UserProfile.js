import React, { useEffect, useState } from "react";
import { getUserDetails } from "@/api/users/actions";
import { useRouter } from "next/router";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const router = useRouter();
  const { userId } = router.query; // Extract userId from query parameter

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

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className={styles.profileBox}>
      <h2>User Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Date of Joining:</strong>{" "}
        {new Date(user.dateJoined).toLocaleDateString()}
      </p>
      <p>
        <strong>Points:</strong> {user.points}
      </p>
    </div>
  );
};

export default UserProfile;
