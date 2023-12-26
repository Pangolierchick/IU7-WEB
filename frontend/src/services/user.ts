import config from "@/config";
import axios from "axios";

export async function signup(login: string, password: string) {
  const r = await axios.post(`${config.apiURL}/user`, { login, password });
  return r.data.userId;
}

export async function getUsername(id: string) {
  try {
    const r = await axios.get(`${config.apiURL}/user/${id}`);
    return r.data.user.login;
  } catch (e) {
    return null;
  }
}
