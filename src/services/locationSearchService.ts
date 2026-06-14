import { DEMO_MODE } from '../config/demoMode';

export type LocationSearchResult = {
  id: string;
  displayName: string;
  addressLabel: string;
  latitude: number;
  longitude: number;
  keywords?: string[];
};

const fallbackResults: LocationSearchResult[] = [
  {
    id: 'fallback-evergreen-brick-works',
    displayName: 'Evergreen Brick Works',
    addressLabel: '550 Bayview Ave, Toronto',
    latitude: 43.6846,
    longitude: -79.3655,
    keywords: ['park', 'ravine', 'market', 'outdoors']
  },
  {
    id: 'fallback-high-park',
    displayName: 'High Park',
    addressLabel: '1873 Bloor St W, Toronto',
    latitude: 43.6465,
    longitude: -79.4637,
    keywords: ['park', 'walk', 'outdoors']
  },
  {
    id: 'fallback-riverdale-park-east',
    displayName: 'Riverdale Park East',
    addressLabel: '550 Broadview Ave, Toronto',
    latitude: 43.6696,
    longitude: -79.3557,
    keywords: ['park', 'view', 'skyline']
  },
  {
    id: 'fallback-trillium-park',
    displayName: 'Trillium Park',
    addressLabel: '955 Lake Shore Blvd W, Toronto',
    latitude: 43.6307,
    longitude: -79.4091,
    keywords: ['park', 'waterfront', 'walk']
  },
  {
    id: 'fallback-st-lawrence-market',
    displayName: 'St. Lawrence Market',
    addressLabel: '93 Front St E, Toronto',
    latitude: 43.6487,
    longitude: -79.3715,
    keywords: ['food', 'market']
  },
  {
    id: 'fallback-reference-library',
    displayName: 'Toronto Reference Library',
    addressLabel: '789 Yonge St, Toronto',
    latitude: 43.6719,
    longitude: -79.3867,
    keywords: ['study', 'library', 'quiet']
  },
  {
    id: 'fallback-kensington',
    displayName: 'Kensington Market',
    addressLabel: 'Kensington Market, Toronto',
    latitude: 43.6548,
    longitude: -79.4002,
    keywords: ['food', 'coffee', 'shopping', 'market']
  },
  {
    id: 'fallback-ago',
    displayName: 'Art Gallery of Ontario',
    addressLabel: '317 Dundas St W, Toronto',
    latitude: 43.6536,
    longitude: -79.3925,
    keywords: ['art', 'gallery', 'museum']
  },
  {
    id: 'fallback-trinity-bellwoods',
    displayName: 'Trinity Bellwoods Park',
    addressLabel: '790 Queen St W, Toronto',
    latitude: 43.6471,
    longitude: -79.4145,
    keywords: ['park', 'friends', 'picnic']
  },
  {
    id: 'fallback-harbourfront-centre',
    displayName: 'Harbourfront Centre',
    addressLabel: '235 Queens Quay W, Toronto',
    latitude: 43.6389,
    longitude: -79.3832,
    keywords: ['waterfront', 'culture', 'events']
  }
];

export const locationSearchService = {
  async search(query: string): Promise<LocationSearchResult[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];
    if (DEMO_MODE) return fallbackFor(trimmed);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&addressdetails=1&q=${encodeURIComponent(trimmed)}`;
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Sparkbook Expo preview'
        }
      });
      if (!response.ok) throw new Error('Location search unavailable');
      const data = await response.json();
      const results = Array.isArray(data) ? data.map(toResult).filter(Boolean) as LocationSearchResult[] : [];
      return results.length ? results : fallbackFor(trimmed);
    } catch {
      return fallbackFor(trimmed);
    }
  },
  fallbackResults
};

function toResult(item: any): LocationSearchResult | null {
  const latitude = Number(item.lat);
  const longitude = Number(item.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const name = item.name || item.display_name?.split(',')[0] || 'Selected place';
  return {
    id: String(item.place_id || `${latitude}-${longitude}`),
    displayName: name,
    addressLabel: item.display_name || name,
    latitude,
    longitude
  };
}

function fallbackFor(query: string) {
  const normalized = query.toLowerCase();
  return fallbackResults.filter((item) =>
    item.displayName.toLowerCase().includes(normalized) ||
    item.addressLabel.toLowerCase().includes(normalized) ||
    (item.keywords || []).some((keyword) => keyword.includes(normalized))
  ).slice(0, 4);
}
