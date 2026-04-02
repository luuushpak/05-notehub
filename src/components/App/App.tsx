import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { fetchNotes } from "../../services/noteService";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { Toaster } from "react-hot-toast";
import EmptyNotesMessage from "../EmptyNotesMessage/EmptyNotesMessage";

export default function App() {
  const [query, setQuery] = useState("");
  const [sheet, setSheet] = useState(1);
  const [isModal, setIsModal] = useState(false);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["notes", query, sheet],
    queryFn: () => fetchNotes({ query, sheet }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const fetchedNotes = data?.notes ?? [];

  const handleSelectPage = (selected: number) => {
    setSheet(selected);
  };

  const handleInputChange = useDebouncedCallback((value: string) => {
    setQuery(value);
    setSheet(1);
  }, 1000);

  const handleShowModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onInputChange={handleInputChange} />
        {totalPages > 1 && (
          <Pagination
            page={sheet}
            totalPages={totalPages}
            selectPage={handleSelectPage}
          />
        )}
        <button className={css.button} onClick={handleShowModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {fetchedNotes.length > 0 && <NoteList notes={fetchedNotes} />}
      {!isLoading && !isError && fetchedNotes.length === 0 && (
        <EmptyNotesMessage />
      )}
      {isModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <NoteForm handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <Toaster position="top-center" />
    </div>
  );
}
