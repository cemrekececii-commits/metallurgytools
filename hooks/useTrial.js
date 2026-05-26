"use client";

/**
 * useTrial()
 *
 * Giriş yapmış kullanıcının trial / plan durumunu döndürür.
 * Trial dolmuşsa isteğe bağlı olarak /subscribe'a yönlendirir.
 *
 * Kullanım:
 *   const { mode, active, daysLeft, loading } = useTrial();
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useTrial({ redirectOnExpiry = false } = {}) {
  const router = useRouter();
  const [state, setState] = useState({ loading: true, authenticated: false, active: false, daysLeft: 0, mode: null });

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/trial/init");
        const data = await res.json();

        setState({
          loading:       false,
          authenticated: data.authenticated ?? false,
          active:        data.active        ?? false,
          daysLeft:      data.daysLeft      ?? 0,
          mode:          data.mode          ?? null,
        });

        if (redirectOnExpiry && data.authenticated && !data.active) {
          router.push("/subscribe");
        }
      } catch {
        setState(s => ({ ...s, loading: false }));
      }
    })();
  }, []);

  return state;
}
