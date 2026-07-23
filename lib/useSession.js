"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// session === undefined  -> 아직 로딩 중
// session === null       -> 로그인 안 됨
// session === {...}      -> 로그인 됨
export function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
