"use client"; // Error boundaries must be Client Components
import { usePreferences } from "@/components/ui-preferences";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  const { t } = usePreferences();
  return (
    <main className="container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-12 text-center">
      <h2 className="text-2xl font-semibold">{t("errorTitle")}</h2>
      <p className="max-w-2xl text-muted-foreground">{error.message}</p>
      <button className="rounded-lg bg-primary px-5 py-3 text-primary-foreground" onClick={() => retry()}>{t("tryAgain")}</button>
    </main>
  );
}
