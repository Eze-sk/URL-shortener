import { EXPRESS_API } from "@consts/config";
import axios from "axios";

export const api = axios.create({
  baseURL: EXPRESS_API,
  withCredentials: true,
});
