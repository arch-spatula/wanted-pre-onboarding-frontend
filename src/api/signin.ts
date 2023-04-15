import { AxiosError } from "axios";
import { AUTH_PATH, SIGNIN_PATH } from "../constants/constants";
import { client } from "./client";

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{access_token: string} | "비밀번호가 일치하지 않습니다." | "가입되지 않은 이메일입니다">}
 */
async function signin(email: string, password: string) {
  try {
    const res = await client.post(
      AUTH_PATH + SIGNIN_PATH,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.status === 200) return res.data;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response?.status === 401) return "비밀번호가 일치하지 않습니다.";
    if (err.response?.status === 404) return "가입되지 않은 이메일입니다";
  }
}

export default signin;
