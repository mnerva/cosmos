export async function fetchOffers() {
  const apiUrl = import.meta.env.VITE_API_URL;
  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch offers');

    const data = await res.json();
    return data;
} catch (error) {
  console.error('Error fetching offers:', error);
  return [];
  }
}