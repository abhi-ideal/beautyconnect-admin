import CryptoJS from "crypto-js";

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;

if (!secretKey) {
  throw new Error("Secret key not found in environment variables");
}

// Function to encrypt access token
export const encryptAccessToken = (accessToken) => {
  if (!accessToken) {
    console.error("No access token provided for encryption");
    return null;
  }

  try {
    const encryptedToken = CryptoJS.AES.encrypt(
      JSON.stringify(accessToken),
      secretKey
    ).toString();
    return encryptedToken;
  } catch (error) {
    console.error("Error during encryption:", error.message);
    return null;
  }
};

// Function to decrypt access token
export const decryptAccessToken = (encryptedToken) => {
  if (!encryptedToken) {
    console.error("No encrypted token provided for decryption");
    return null;
  }

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // Check if the decryption process resulted in an empty string or malformed data
    if (!decryptedData) {
      throw new Error("Decryption failed, resulted in an empty string");
    }

    const parsedData = JSON.parse(decryptedData);
    return parsedData;
  } catch (error) {
    console.error("Error during decryption:", error.message);
    return null;
  }
};