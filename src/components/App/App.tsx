import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { FetchMoviesResponse } from "../../services/movieService";


import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = (newQuery: string) => {
    setSelectedMovie(null);
    setQuery(newQuery);
    setPage(1);
  };

const { data, isLoading, isError } = useQuery<FetchMoviesResponse>({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: query.trim().length > 0,
  placeholderData: keepPreviousData,
});


  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && !isLoading && !isError && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data, isLoading, isError, query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />

      <div className={css.app}>
        {isLoading && <Loader />}

        {!isLoading && isError && <ErrorMessage />}

        {!isLoading && !isError && movies.length > 0 && (
          <>
            

            {totalPages > 1 && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={css.pagination}
                activeClassName={css.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
            <MovieGrid movies={movies} onSelect={setSelectedMovie} />
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
