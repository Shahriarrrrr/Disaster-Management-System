export async function disastersLoader() {
  try {
    const response = await fetch(
      "https://api.reliefweb.int/v1/disasters?appname=rwint-user-0&profile=list&preset=latest&slim=1"
    );

    if (!response.ok) {
      throw new Response("Failed to fetch disaster data", { status: response.status });
    }

    const data = await response.json();
    return data.data; // This will be available in your component via useLoaderData
  } catch (error) {
    throw new Response("Error loading disasters: " + error.message, { status: 500 });
  }
}
