import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import type { ViewedEntry } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { DifficultyBadge } from "@/components/docs/DifficultyBadge";
import { InlineText } from "@/components/docs/InlineText";
import { CommentSection } from "@/components/comments/CommentSection";
import type { Entry } from "@/types";

interface EntryWithRelated extends Entry {
  related: Entry[];
}

async function fetchEntry(slug: string): Promise<EntryWithRelated> {
  const res = await fetch(`/api/entries/${slug}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default function DocsDetail() {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  const {
    data: entry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["entry", slug],
    queryFn: () => fetchEntry(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!entry) return;
    try {
      const raw = localStorage.getItem("cs:viewed");
      const viewed: ViewedEntry[] = raw ? JSON.parse(raw) : [];
      const without = viewed.filter((v) => v.slug !== entry.slug);
      const next: ViewedEntry[] = [
        {
          slug: entry.slug,
          title: entry.title,
          categorySlug: entry.categorySlug,
          viewedAt: new Date().toISOString(),
        },
        ...without,
      ].slice(0, 20);
      localStorage.setItem("cs:viewed", JSON.stringify(next));
    } catch {
      // localStorage unavailable
    }
  }, [entry?.slug]);

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-muted-foreground">Entry not found.</p>
        <Link
          to="/docs"
          className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-3 w-3" /> Back to docs
        </Link>
      </div>
    );
  }

  const howToSchema = entry
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: entry.title,
        description: entry.problem,
        keywords: entry.tags.join(", "),
        step: [
          {
            "@type": "HowToStep",
            name: "Solution",
            text: entry.solution,
          },
          {
            "@type": "HowToStep",
            name: "Code example",
            text: entry.code,
          },
          {
            "@type": "HowToStep",
            name: "Why this works",
            text: entry.explanation,
          },
        ],
      }
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {entry && (
        <SEO
          title={entry.title}
          description={entry.problem.slice(0, 160)}
          canonical={`/docs/${entry.categorySlug}/${entry.slug}`}
          type="article"
          jsonLd={howToSchema}
        />
      )}
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
        <Link to="/docs" className="hover:text-foreground transition-colors">
          Docs
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`/docs/${category}`}
          className="hover:text-foreground transition-colors capitalize"
        >
          {category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{slug}</span>
      </nav>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        entry && (
          <article className="space-y-10">
            {/* Header */}
            <header>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <DifficultyBadge difficulty={entry.difficulty} />
                <Badge variant="outline" className="text-xs capitalize">
                  {entry.type}
                </Badge>
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold leading-snug text-foreground">
                {entry.title}
              </h1>
            </header>

            {/* Problem */}
            <Section label="Problem">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <InlineText text={entry.problem} />
              </p>
            </Section>

            {/* Solution */}
            <Section label="Solution">
              <p className="text-sm leading-relaxed text-foreground">
                <InlineText text={entry.solution} />
              </p>
            </Section>

            {/* Code */}
            <Section label="Code">
              <CodeBlock code={entry.code} language={entry.codeLanguage} />
            </Section>

            {/* Explanation */}
            <Section label="Why this works">
              <p className="text-sm leading-relaxed text-muted-foreground">
                <InlineText text={entry.explanation} />
              </p>
            </Section>

            {/* Pitfalls */}
            {entry.pitfalls.length > 0 && (
              <Section label="Watch out for">
                <ul className="space-y-2">
                  {entry.pitfalls.map((p, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="mt-0.5 shrink-0 text-primary/50 font-medium">—</span>
                      <span>
                        <InlineText text={p} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Related */}
            {entry.related.length > 0 && (
              <>
                <Separator />
                <Section label="Related entries">
                  <ul className="space-y-1">
                    {entry.related.map((r) => (
                      <li key={r.id}>
                        <Link
                          to={`/docs/${r.categorySlug}/${r.slug}`}
                          className="text-sm text-primary hover:underline underline-offset-2"
                        >
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Section>
              </>
            )}

            <CommentSection entrySlug={entry.slug} />
          </article>
        )
      )}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-[11px] font-medium text-muted-foreground">
        {label}
      </h2>
      {children}
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-3/4" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}
