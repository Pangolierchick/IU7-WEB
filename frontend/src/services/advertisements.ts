import config from "@/config";
import axios from "axios";

export const getAdvertisement = async (id: string) => {
  const r = await axios.get(`${config.apiURL}/listing/${id}`);
  return r.data.advertisement;
};

export const getAdvertisementsById = async (userId: string) => {
  try {
    const r = await axios.get(`${config.apiURL}/listings?ownerId=${userId}`);
    return r.data.advertisements;
  } catch (e) {
    return [];
  }
};

export async function getAdvertisementsWithDescrFilter(
  description: string | null
) {
  const r = await axios.get(`${config.apiURL}/listings`);

  const ads: any[] = r.data.advertisements;

  if (description) {
    const filtered = ads.filter(
      (v) =>
        (v.description as string).search(description.toLocaleLowerCase()) !== -1
    );

    return filtered;
  }

  return ads;
}

export const postAdvertisement = async (
  token: string,
  address: string,
  description: string,
  cost: number
) => {
  const r = await axios.post(
    `${config.apiURL}/listing`,
    {
      address,
      description,
      cost,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return r.data.id;
};
