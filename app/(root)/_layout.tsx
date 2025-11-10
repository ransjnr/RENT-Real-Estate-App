import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { loading, isLoggedIn } = useGlobalContext();

  // Do not block the UI while auth is loading; only redirect after it finishes
  if (!loading && !isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return <Slot />;
}
