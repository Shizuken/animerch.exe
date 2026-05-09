import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PixelButton } from "@/components/animerch/PixelButton";
import { Footer } from "@/components/animerch/Footer";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Sign in — animerch.exe";
    // If already signed in, bounce to /admin
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message ?? String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col cloud-sky">
      <header className="sticky top-0 z-40 w-full bg-white border-b-[4px] border-ink">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-pixel text-[14px] text-ink">
            <span aria-hidden className="inline-block w-3 h-3 bg-gold border-2 border-ink float-2" />
            animerch.exe
          </Link>
          <Link to="/"><PixelButton className="text-[8px] sm:text-[10px]">← BACK</PixelButton></Link>
        </div>
      </header>

      <main className="flex-1 container py-12 flex items-center justify-center">
        <div className="pixel-box bg-card p-6 w-full max-w-md">
          <div className="admin-titlebar mb-4 flex items-center justify-between">
            <span>[ LOGIN.EXE ]</span>
            <span className="cursor-blink">_</span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="font-pixel text-[8px] text-ink">EMAIL</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pixel-input w-full mt-1"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="font-pixel text-[8px] text-ink">PASSWORD</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pixel-input w-full mt-1"
                autoComplete="current-password"
              />
            </label>
            <PixelButton type="submit" variant="primary" disabled={loading} className="w-full text-[10px]">
              {loading ? "..." : "▶ LOGIN"}
            </PixelButton>
          </form>

          <div className="my-4 text-center font-pixel text-[8px] text-ink/60">— OR —</div>

          <PixelButton type="button" onClick={google} className="w-full text-[10px]">
            ◆ CONTINUE WITH GOOGLE
          </PixelButton>

          <p className="mt-4 font-body text-xs text-ink/70 text-center">
            Only the admin can log in to access the database.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}