import Link from "next/link";

interface EntitySEOSectionsProps {
  title?: string;
}

interface Feature {
  title: string;
  description: string;
}

export function FeatureGrid({ title, features }: { title: string; features: Feature[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(f => (
          <div key={f.title} className="p-5 rounded-xl border border-border bg-card">
            <h3 className="font-bold text-sm mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className="mt-16 grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-bold text-lg mb-4 text-accent">✓ Pros</h3>
        <ul className="space-y-2">
          {pros.map(p => (
            <li key={p} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-accent shrink-0">✓</span> {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-bold text-lg mb-4 text-destructive">✗ Cons</h3>
        <ul className="space-y-2">
          {cons.map(c => (
            <li key={c} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-destructive shrink-0">✗</span> {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

interface ComparisonRow {
  feature: string;
  ours: string;
  babyCenter: string;
  nameberry: string;
  ssa: string;
}

export function ComparisonTable({ title, toolName, rows }: { title: string; toolName: string; rows: ComparisonRow[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left p-3 font-semibold">Feature</th>
              <th className="text-left p-3 font-semibold text-primary">{toolName}</th>
              <th className="text-left p-3 font-semibold">BabyCenter</th>
              <th className="text-left p-3 font-semibold">Nameberry</th>
              <th className="text-left p-3 font-semibold">SSA.gov</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.feature} className="border-t border-border">
                <td className="p-3 font-medium">{r.feature}</td>
                <td className="p-3 text-primary font-medium">{r.ours}</td>
                <td className="p-3 text-muted-foreground">{r.babyCenter}</td>
                <td className="p-3 text-muted-foreground">{r.nameberry}</td>
                <td className="p-3 text-muted-foreground">{r.ssa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface UseCase {
  who: string;
  scenario: string;
  outcome: string;
}

export function UseCases({ cases }: { cases: UseCase[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Who Uses This Tool?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map(c => (
          <div key={c.who} className="p-5 rounded-xl border border-border bg-card">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{c.who}</div>
            <p className="text-sm text-muted-foreground mb-2"><strong className="text-foreground">Scenario:</strong> {c.scenario}</p>
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">Result:</strong> {c.outcome}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface WorkedExample {
  input: string;
  finding: string;
  insight: string;
}

export function WorkedExamples({ examples }: { examples: WorkedExample[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Worked Examples</h2>
      <div className="space-y-4">
        {examples.map(e => (
          <div key={e.input} className="p-5 rounded-xl border border-border bg-card">
            <div className="font-bold text-sm mb-1">Input: &quot;{e.input}&quot;</div>
            <p className="text-sm text-muted-foreground mb-1"><strong className="text-foreground">Finding:</strong> {e.finding}</p>
            <p className="text-sm text-muted-foreground"><strong className="text-foreground">Insight:</strong> {e.insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

interface RelatedTool {
  to: string;
  name: string;
  blurb: string;
}

export function RelatedToolsInline({ tools }: { tools: RelatedTool[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(t => (
          <Link key={t.to} href={t.to} className="group p-5 rounded-xl border border-border bg-card hover:shadow-md transition-all">
            <h3 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{t.name}</h3>
            <p className="text-xs text-muted-foreground">{t.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
