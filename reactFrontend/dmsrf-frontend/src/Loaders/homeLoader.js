// loaders/homeLoader.js

import api from "../api";

export async function homeLoader() {
  try {
    const [donationsRes, causesRes] = await Promise.all([
      api.get("donation/api/donation/?mine=true"),
      api.get("api/campaigns/"),
    ]);

    return {
      donations: donationsRes.data,
      causes: causesRes.data,

    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
