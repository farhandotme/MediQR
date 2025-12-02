import userModels from "../models/userModels";

export const generateUniqueId = async (): Promise<string> => {
  let uniqueId: string = "";
  let exists = true;

  while (exists) {
    uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await userModels.findOne({ uniqueId });
    if (!user) exists = false;
  }
  return uniqueId;
};
