import config from "@/config";
import axios from "axios";
import { getCookie } from "cookies-next";

export const auth = async (login: string, password: string) => {
  const r = await axios.get(
    `${config.apiURL}/auth?login=${login}&password=${password}`
  );

  return [r.data.id, r.data.token];
};

export const isLogged = () => {
  const token = getCookie("token");

  return !!token;
};
