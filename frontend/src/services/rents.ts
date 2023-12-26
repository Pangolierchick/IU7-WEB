import config from "@/config";
import axios from "axios";

export async function postRent(
  token: string,
  adId: string,
  from: string,
  to: string
): Promise<string> {
  const r = await axios.post(
    `${config.apiURL}/rent`,
    { adId, from, to },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return r.data.id;
}

export const getRents = async (userId: string) => {
  try {
    const r = await axios.get(`${config.apiURL}/rents?userId=${userId}`);
    return r.data.rents;
  } catch (e) {
    return [];
  }
};
