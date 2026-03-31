import axios from "axios";
import type { Note } from "../types/note";
import type { OrderFormValues } from "../types/note";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

interface FetchNotesProps {
  query: string;
  sheet: number;
}

interface ApiFetchNotes {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes({
  query: search,
  sheet: page,
}: FetchNotesProps): Promise<ApiFetchNotes> {
  const response = await api.get<ApiFetchNotes>("/notes", {
    params: {
      search,
      page,
      perPage: 12,
    },
  });

  return response.data;
}

export async function createNote(newNote: OrderFormValues): Promise<void> {
  await api.post("/notes", newNote);
}
export async function deleteNote(id: string): Promise<void> {
  await api.delete(`/notes/${id}`);
}
