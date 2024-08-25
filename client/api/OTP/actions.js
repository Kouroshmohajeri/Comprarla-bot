import API from "../server";

export const generateOtp = async (userId) => {
  try {
    await API.post("/otp/generate", { userId });
  } catch (error) {
    console.error("Error generating OTP:", error);
  }
};

export const verifyOtp = async (userId, otp) => {
  try {
    const response = await API.post("/otp/verify", { userId, otp });
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
