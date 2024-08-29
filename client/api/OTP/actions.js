import API from "../server";

export const generateOtp = async (userId) => {
  try {
    await API.post("/otp/generate", { userId });
  } catch (error) {
    console.error("Error generating OTP:", error);
  }
};

export async function verifyToken(authToken) {
  try {
    const response = await API.get("/otp/verifyToken", {
      params: { auth: authToken },
    });

    return response.data;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
}
