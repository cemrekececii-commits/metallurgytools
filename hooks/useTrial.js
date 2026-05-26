"use client";

/**
 * useTrial()
 *
 * Tool sayfalarında kullanılır:
 *  - İlk render'da /api/trial/init POST çağırarak trial'ı başlatır
 *  - Güncel durumu (daysLeft, active, expired) döndürür
 *  - Trial dolmuşsa /subscribe'a yönlendirir
 *
 * Kullanım:
 *   const { trialActive, daysLeft, loading } = useTrial();
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useTrial({ redirectOnExpiry = true } = {}) {
  const router = useRouter();
  const [state, setState] = useState({
    loading:     true,
    trialActive: false,
    daysLeft:    0,
    expired:     false,
    never:       false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/trial/init", { method: "POST" });
        const data = await res.json();

        setState({
          loading:     false,
          trialActive: data.active  ?? false,
          daysLeft:    data.daysLeft ?? 0,
          expired:     data.expired ?? false,
          never:       data.never   ?? false,
        });

        if (redirectOnExpiry && data.expired) {
          router.push("/subscribe");
        }
      } catch {
        setState(s => ({ ...s, loading: false }));
      }
    })();
  }, []);

  return state;
}
