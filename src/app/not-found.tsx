import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-5 py-32 text-center sm:px-8">
      <p className="font-script text-4xl text-gold-bright">oops</p>
      <h1 className="font-display mt-4 text-5xl font-medium leading-tight text-balance">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-text-muted">{t("line")}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg">
          {t("cta")}
        </Button>
        <Button href="/sitemap" variant="ghost" size="lg">
          {t("ctaSitemap")}
        </Button>
      </div>
    </section>
  );
}
