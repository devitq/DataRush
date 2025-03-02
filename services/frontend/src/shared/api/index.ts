import { ofetch } from "ofetch";
import { getToken, removeToken } from "../token";

const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

export class ApiError extends Error {
  response: Response;
  status: number;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
    this.status = response.status;
  }
}

export const apiFetch = ofetch.create({
  baseURL: BASE_URL,
  async onResponseError({ response }) {
    throw new ApiError(response);
  },
});

export const userFetch = ofetch.create({
  baseURL: BASE_URL,
  async onRequest({ options }) {
    options.headers.set("Authorization", "Bearer " + getToken());
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      removeToken();
      window.location.href = "/login";
      return;
    }

    throw new ApiError(response);
  },
});
