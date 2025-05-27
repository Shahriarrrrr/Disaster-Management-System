// loaders/homeLoader.js

import api from "../api";

export async function donationLoader() {
  try {
    const [donationsRes] = await Promise.all([
      api.get("donation/api/donation/?mine=true"),

    ]);

    return {
      donations: donationsRes.data,


    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
