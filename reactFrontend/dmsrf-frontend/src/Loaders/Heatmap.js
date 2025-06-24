// loaders/homeLoader.js
import api from "../api";

export async function heatmapLoader() {
  try {
    const [heatmapRes] = await Promise.all([
      api.get("heatmap/api/heatmaps/"),

    ]);

    return {
      data: heatmapRes.data,


    };
  } catch (error) {
    console.error("Loader error:", error);
    throw new Response("Failed to load data", { status: 500 });
  }
}
