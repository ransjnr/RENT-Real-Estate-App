import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, router } from "expo-router";
import React, { useEffect } from "react";

const SignIn = () => {
  const { loading, isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [loading, isLoggedIn]);

  if (!loading && isLoggedIn) {
    return <Redirect href="/" />;
  }

  return null;
};

export default SignIn;
