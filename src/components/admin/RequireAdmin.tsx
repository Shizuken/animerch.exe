import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "unauth" | "not-admin" | "admin";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    let active = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (active) setState("unauth");
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!active) return;
      if (error || !data) setState("not-admin");
      else setState("admin");
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center cloud-sky">
        <div className="font-pixel text-[10px] text-ink">LOADING...</div>
      </div>
    );
  }
  if (state === "unauth") return <Navigate to="/auth" replace />;
  if (state === "not-admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 cloud-sky p-6 text-center">
        <div className="pixel-box bg-card p-6 max-w-md">
          <div className="font-pixel text-[12px] text-ink mb-3">⚠ ACCESS DENIED</div>
          <p className="font-body text-sm text-ink/80 mb-4">
            This account is not an admin. Only the admin can open the database panel.
          </p>
          <button
            className="pixel-btn text-[10px]"
            onClick={async () => { await supabase.auth.signOut(); window.location.href = "/auth"; }}
          >
            ◀ SIGN OUT
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}