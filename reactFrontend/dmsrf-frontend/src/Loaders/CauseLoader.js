import api from "../api";

export async function CauseLoader() {
  try {
    const [causesRes] = await Promise.all([
         api.get("api/campaigns/"),
    ]);

    return {
      causes: causesRes.data
    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
