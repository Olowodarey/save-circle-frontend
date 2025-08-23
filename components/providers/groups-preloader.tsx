"use client";

import { useGroupsPreloader } from "@/hooks/use-groups-preloader";

/**
 * Groups Preloader Component
 * This component wraps the useGroupsPreloader hook so it can be used in the app layout
 */
export function GroupsPreloader() {
  useGroupsPreloader();
  return null; // This component doesn't render anything
}
