// loaders/homeLoader.js

import api from "../api";

export async function VolunteerProfileLoader() {
  try {
    const [volunteerProfileRes, missionDataRes] = await Promise.all([
      api.get("/volunteer/api/volunteers/"),
      api.get("/mission/api/missions/")

    ]);

    return {
      volunData: volunteerProfileRes.data,
      missionData: missionDataRes.data


    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
