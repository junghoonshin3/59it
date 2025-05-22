import { create } from "zustand";
import { fetchPlaceSuggestions } from "@/api/googlePlaces";

export type Place = {
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
};
type DisplayName = {
  text: string;
  languageCode: string;
};

type Location = {
  latitude: number;
  longitude: number;
};

interface PlaceStore {
  loading: boolean;
  lastQueried: string;
  searchQuery: string;
  places: Place[];

  nextPageToken: string | null;
  setSearchQuery: (query: string) => void;

  searchPlaces: (isLoadMore?: boolean) => Promise<void>;
}

export const usePlaceStore = create<PlaceStore>((set, get) => ({
  loading: false,
  searchQuery: "",
  selectedPlace: null,
  lastQueried: "", // 초기값
  places: [],
  nextPageToken: null,
  setSearchQuery: (query) => set({ searchQuery: query }),

  searchPlaces: async (isLoadMore = false) => {
    const { searchQuery, nextPageToken, lastQueried } = get();

    // 🔒 중복 쿼리면 실행 방지
    if (!searchQuery || (!isLoadMore && searchQuery === lastQueried)) return;

    // 다음 페이지 요청인데 토큰이 없으면 리턴
    if (isLoadMore && !nextPageToken) return;

    set({ loading: true });

    try {
      const res = await fetchPlaceSuggestions(
        {
          textQuery: searchQuery,
          languageCode: "ko",
          regionCode: "kr",
          ...(isLoadMore && nextPageToken ? { pageToken: nextPageToken } : {}),
        },
        {
          apiKey: `${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`,
          contentType: "application/json",
          fieldMask:
            "places.displayName,places.formattedAddress,places.location,nextPageToken",
        }
      );
      const newPlaces = res.data.places || [];
      const nextToken = res.data.nextPageToken ?? null;

      set((prev) => ({
        places: isLoadMore ? [...prev.places, ...newPlaces] : newPlaces,
        nextPageToken: nextToken,
        lastQueried: isLoadMore ? prev.lastQueried : searchQuery,
        loading: false,
      }));
    } catch (err) {
      console.error("Place search error", err);
      set({ places: [], nextPageToken: null, loading: false });
    }
  },
}));
