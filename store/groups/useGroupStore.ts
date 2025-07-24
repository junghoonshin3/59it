import { GroupRequest } from "@/api/groups/types";
import { Group } from "./types";
import { create } from "zustand";
import { Place } from "@/types/types";
import dayjs from "dayjs";

interface CreateGroupState {
  groupNm: string;
  selectedPlace: Place | null;
  selectedDateTime: dayjs.Dayjs;
  setGroupNm: (name: string) => void;
  setSelectedPlace: (place: Place) => void;
  setSelectedDate: (date: dayjs.Dayjs) => void;
  setSelectedTime: (date: dayjs.Dayjs) => void;
  clearAll: () => void;
}

export const useCreateGroupStore = create<CreateGroupState>((set, get) => ({
  groupNm: "",
  selectedPlace: null,
  selectedDateTime: dayjs(),
  setGroupNm: (name) => set({ groupNm: name }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setSelectedDate: (date) =>
    set((prev) => ({
      selectedDateTime: prev.selectedDateTime
        .set("year", date.year())
        .set("month", date.month())
        .set("date", date.date())
        .clone(),
    })),
  setSelectedTime: (time) =>
    set((prev) => ({
      selectedDateTime: prev.selectedDateTime
        .set("hour", time.hour())
        .set("minute", time.minute())
        .clone(),
    })),
  clearAll: () =>
    set({
      groupNm: "",
      selectedPlace: null,
      selectedDateTime: dayjs(),
    }),
}));
