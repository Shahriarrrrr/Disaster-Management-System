// loaders/homeLoader.js

import api from "../api";

export async function VolunteerProfileLoader() {
  try {
    const [volunteerProfileRes, missionDataRes, requestedDataRes, workshopDataRes] = await Promise.all([
      api.get("/volunteer/api/volunteers/"),
      api.get("/mission/api/missions/"),
      api.get("/mission/api/mission-requests/"),
      api.get("/workshop/api/courses/"),


    ]);

    return {
      volunData: volunteerProfileRes.data,
      missionData: missionDataRes.data,
      requestedData: requestedDataRes.data,
      coursedData: workshopDataRes.data,


    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
