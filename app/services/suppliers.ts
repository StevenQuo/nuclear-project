export type Supplier = {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
};

type SuppliersResponse = {
  data: Supplier[];
};

export async function fetchSuppliers(): Promise<Supplier[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    'http://localhost:8000';

  const res = await fetch(`${baseUrl}/api/suppliers`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch suppliers: ${res.status}`);
  }

  const json = (await res.json()) as SuppliersResponse;
  return Array.isArray(json?.data) ? json.data : [];
}
