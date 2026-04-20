export const STORAGE_KEYS = {
  token: "medrx_token",
  user: "medrx_user",
  result: "medrx_latest_result",
};

export const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const getJSON = (key, fallback = null) => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
