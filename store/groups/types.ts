export interface Group {
  groupNm: string;
  placeNm: string;
  address: string;
  hour: string;
  time: string;
}

export type Place = {
  place_id: string;
  formattedAddress: string;
  location: Location;
  displayName: DisplayName;
};

type DisplayName = {
  text: string;
  languageCode: string;
};
