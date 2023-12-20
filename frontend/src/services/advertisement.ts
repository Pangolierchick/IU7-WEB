import config from "@/config";
import axios from "axios";

export const getAdvertisement = async (id: string) => {
  const r = await axios.get(`${config.apiURL}/listing/${id}`);
  return r.data.advertisement;
};
