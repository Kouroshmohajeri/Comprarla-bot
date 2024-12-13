import React, { useState, useEffect } from "react";
import { checkManagement } from "@/api/Management/actions";
import { getCollectedGiftsByUser } from "@/api/CollectedGifts/actions.js";
import { createGift, getAllGifts } from "@/api/Gifts/actions.js"; // Import getAllGifts
import Cookies from "js-cookie";
import { Modal, TextField, Button, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./GiftPanel.module.css";

const GiftPanel = () => {
  const [isManagement, setIsManagement] = useState(false);
  const [collectedGifts, setCollectedGifts] = useState([]);
  const [allGifts, setAllGifts] = useState([]); // State for all gifts
  const [openModal, setOpenModal] = useState(false);
  const [giftData, setGiftData] = useState({
    title: "",
    description: "",
    points: "",
    expirationDate: "",
    type: "instagram ad",
    link: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = Cookies.get("userId");
      if (!userId) return;

      try {
        const response = await checkManagement(userId);
        setIsManagement(response?.isManagement || false);

        // Fetch collected gifts by user
        const giftsResponse = await getCollectedGiftsByUser();
        setCollectedGifts(giftsResponse.data || []);

        // If the user is management, fetch all gifts
        if (response?.isManagement) {
          const allGiftsResponse = await getAllGifts();
          setAllGifts(allGiftsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGiftData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddGift = async () => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    try {
      await createGift({ ...giftData, createdById: userId });
      setOpenModal(false);

      // Refresh the list of collected gifts
      const giftsResponse = await getCollectedGiftsByUser();
      setCollectedGifts(giftsResponse.data || []);

      // Show success toast
      toast.success("Gift added successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error adding gift:", error);

      // Show error toast
      toast.error("Failed to add gift. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={styles.panelContainer}>
      <ToastContainer /> {/* Toast container for displaying toasts */}
      {isManagement && (
        <button className={styles.addButton} onClick={() => setOpenModal(true)}>
          + Add
        </button>
      )}
      {collectedGifts.length === 0 ? (
        <div className={styles.noGiftsMessage}>
          No gifts have been collected yet
        </div>
      ) : (
        <div className={styles.giftList}>
          {collectedGifts.map((gift) => (
            <div key={gift._id} className={styles.giftBox}>
              <h3>{gift.giftId.title}</h3>
              <p>{gift.giftId.description}</p>
              <p>Quantity: {gift.quantity}</p>
              <p>Date Collected: {new Date(gift.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      {isManagement && (
        <>
          <hr className={styles.hrLine} />
          {allGifts.length === 0 ? (
            <div className={styles.noGiftsMessage}>
              No gifts have been added
            </div>
          ) : (
            <div className={styles.managementGiftList}>
              {allGifts.map((gift) => (
                <div
                  key={gift._id}
                  className={styles.managementGiftBox}
                  onClick={() => console.log(`Clicked on gift: ${gift.title}`)}
                >
                  <h3>{gift.title}</h3>
                  <p>{gift.description}</p>
                  <p>Points: {gift.points}</p>
                  <p>
                    Expiration:{" "}
                    {new Date(gift.expirationDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className={styles.modal}
      >
        <div className={styles.modalContent}>
          <h2>Add Gift</h2>
          <TextField
            name="title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={giftData.title}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={giftData.description}
            onChange={handleInputChange}
          />
          <TextField
            name="points"
            label="Points"
            variant="outlined"
            type="number"
            fullWidth
            margin="normal"
            value={giftData.points}
            onChange={handleInputChange}
          />
          <TextField
            name="expirationDate"
            label="Expiration Date"
            variant="outlined"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={giftData.expirationDate}
            onChange={handleInputChange}
          />
          <TextField
            name="type"
            label="Type"
            variant="outlined"
            select
            fullWidth
            margin="normal"
            value={giftData.type}
            onChange={handleInputChange}
          >
            <MenuItem value="instagram ad">Instagram Ad</MenuItem>
            <MenuItem value="telegram ad">Telegram Ad</MenuItem>
            <MenuItem value="task ad">Task Ad</MenuItem>
          </TextField>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            fullWidth
            margin="normal"
            value={giftData.link}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddGift}
            className={styles.submitButton}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default GiftPanel;
