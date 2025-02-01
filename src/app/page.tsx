"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // import from next/navigation

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page on load
    router.push("/dashboard");
  }, [router]);

  return null; // This will not render any content as we're redirecting immediately
}
