import Cookie from "js-cookie";

export const getToken = () => {
  return Cookie.get("token");
};

export const saveToken = (token: string) => {
  Cookie.set("token", token, {
    secure: true,
    sameSite: "Strict",
    expires: 30,
  });
};

export const removeToken = () => {
  Cookie.remove("token");
};
