import Link from "next/link";
import Container from "@/components/container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-6xl font-bold text-gray-200 dark:text-gray-800">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        This page doesn&apos;t exist — it may have moved or been removed.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
        Back to home
      </Link>
    </Container>
  );
}
