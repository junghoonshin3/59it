export type MemberLocation = {
  user_id: string;
  group_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
};

type DisplayName = {
  text: string;
  languageCode: string;
};

type Location = {
  latitude: number;
  longitude: number;
};

export type Place = {
  place_id: string;
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
};

export type SharingGroup = {
  group_id: string;
  user_id: string;
};
