/* eslint-disable react/jsx-no-bind */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function Pagination({
  pageIndex,
  isFirstPage,
  isLastPage
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const handleNextPage = () => {
    params.set("page", (pageIndex + 1).toString());
    router.push(`/archive?${params.toString()}`);
  };

  const handlePrevPage = () => {
    params.set("page", (pageIndex - 1).toString());
    router.push(`/archive?${params.toString()}`);
  };

  return (
    <div className="mt-14 flex items-center justify-center">
      <nav className="inline-flex gap-3" aria-label="Pagination">
        <button
          disabled={isFirstPage}
          onClick={handlePrevPage}
          className="btn-pill disabled:pointer-events-none disabled:opacity-40">
          <ChevronLeftIcon className="mr-1 h-3 w-3" aria-hidden="true" />
          <span>Previous</span>
        </button>
        <button
          onClick={handleNextPage}
          disabled={isLastPage}
          className="btn-pill disabled:pointer-events-none disabled:opacity-40">
          <span>Next</span>
          <ChevronRightIcon className="ml-1 h-3 w-3" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
