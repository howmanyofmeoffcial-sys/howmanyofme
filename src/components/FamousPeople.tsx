import { useEffect, useState } from "react";
import { Star, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Person {
  name: string;
  description: string;
  extract: string;
  image: string | null;
  url: string;
}

interface Props {
  name: string;
}

export default function FamousPeople({ name }: Props) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPeople([]);
    setTried(false);

    fetch(`/api/famous-people?name=${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((d: { people: Person[] }) => {
        if (!active) return;
        setPeople(d.people ?? []);
        setLoading(false);
        setTried(true);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setTried(true);
      });

    return () => {
      active = false;
    };
  }, [name]);

  if (!loading && tried && people.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-card p-6">
      <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-primary" />
        🌟 Famous People Named {name}
        {!loading && people.length > 0 && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {people.length} found
          </span>
        )}
      </h3>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-3">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((person) => (
            <a
              key={person.url}
              href={person.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-border bg-secondary/30 p-4 hover:bg-secondary/60 hover:border-primary/40 transition flex flex-col"
            >
              <div className="flex justify-center mb-3">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-3xl">
                    👤
                  </div>
                )}
              </div>
              <div className="flex-1 text-center">
                <h4 className="font-semibold text-sm group-hover:text-primary transition">
                  {person.name}
                </h4>
                {person.description && (
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {person.description}
                  </p>
                )}
                {person.extract && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3">
                    {person.extract}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 mt-3 text-xs text-primary">
                  <ExternalLink className="h-3 w-3" />
                  Wikipedia
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
