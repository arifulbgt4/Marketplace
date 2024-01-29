"use server";
export default async function getLocations(searchText: string) {
  const res = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${searchText}&proximity=ip&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
    { method: "GET" }
  );

  const data = await res.json();
  return data;
}
