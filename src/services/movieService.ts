

import axios from "axios";
import type { Movie } from "../types/movie";

export interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export async function fetchMovies(query: string, page: number): Promise<FetchMoviesResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN as string | undefined;
  if (!token) throw new Error("Missing VITE_TMDB_TOKEN");

  const { data } = await axios.get<FetchMoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query, include_adult: false, language: "en-US", page},
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data;
}

export function getPosterUrl(path: string): string {
  return `https://image.tmdb.org/t/p/w500/${path}`;
}

export function getBackdropUrl(path: string): string {
  return `https://image.tmdb.org/t/p/original/${path}`;
}
