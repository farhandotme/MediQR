import QRCode from "qrcode";
import cloudinary from "./cloudinary";

export const generateQrCodeCloudinary = async (
  uniqueId: string
): Promise<string> => {
  const qrUrl = `http://localhost:8000/user/api/emergency/${uniqueId}`;
  const dataUrl = await QRCode.toDataURL(qrUrl);
  const uploadRes = await cloudinary.uploader.upload(dataUrl, {
    folder: "mediQr",
    public_id: `qr_${uniqueId}`,
    overwrite: true,
  });
  return uploadRes.secure_url;
};
