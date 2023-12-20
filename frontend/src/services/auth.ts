import config from "@/config";
import axios from "axios";

export const auth = async (login: string, password: string) => {
  const r = await axios.get(
    `${config.apiURL}/auth?login=${login}&password=${password}`
  );

  return r.data.token;
};
