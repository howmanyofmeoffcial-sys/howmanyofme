import { Link } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";

/**
 * Reusable entity-SEO building blocks for tool pages.
 * Each block targets attribute coverage Google looks for when
 * understanding a tool entity (features, use cases, pros/cons,
 * comparisons, alternatives, worked examples).
 *
 * All copy is passed in as props so each tool keeps its own voice.
 */

export interface FeatureItem {
  title: string;
  description: string;
}

export const FeatureGrid = ({ title, features }: { title: string; features: FeatureItem[] }) => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {features.map((f) => (
        <div key={f.title} className="p-5 border border-border rounded-xl bg-card">
          <h3 className="font-semibold mb-2">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export const ProsCons = ({ pros, cons }: { pros: string[]; cons: string[] }) => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6">Pros and Cons at a Glance</h2>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Check className="text-primary" size={18} /> Pros
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <Check size={16} className="text-primary mt-0.5 shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <X className="text-destructive" size={18} /> Cons
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {cons.map((c) => (
            <li key={c} className="flex gap-2">
              <X size={16} className="text-destructive mt-0.5 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export interface ComparisonRow {
  feature: string;
  ours: string;
  babyCenter: string;
  nameberry: string;
  ssa: string;
}

export const ComparisonTable = ({
  title,
  toolName,
  rows,
}: {
  title: string;
  toolName: string;
  rows: ComparisonRow[];
}) => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Side-by-side comparison with the most-searched alternatives so you can see where this tool wins and where another option might fit better.
    </p>
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/60">
          <tr>
            <th className="text-left p-3 font-semibold">Feature</th>
            <th className="text-left p-3 font-semibold text-primary">{toolName}</th>
            <th className="text-left p-3 font-semibold">BabyCenter</th>
            <th className="text-left p-3 font-semibold">Nameberry</th>
            <th className="text-left p-3 font-semibold">SSA.gov</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.feature} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
              <td className="p-3 font-medium">{r.feature}</td>
              <td className="p-3 text-muted-foreground">{r.ours}</td>
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

export interface UseCase {
  who: string;
  scenario: string;
  outcome: string;
}

export const UseCases = ({ cases }: { cases: UseCase[] }) => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6">Real-World Use Cases</h2>
    <div className="space-y-4">
      {cases.map((c) => (
        <div key={c.who} className="p-5 rounded-xl border border-border bg-card">
          <p className="font-semibold mb-1">{c.who}</p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong className="text-foreground">Scenario:</strong> {c.scenario}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Outcome:</strong> {c.outcome}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export interface WorkedExample {
  input: string;
  finding: string;
  insight: string;
}

export const WorkedExamples = ({ examples }: { examples: WorkedExample[] }) => (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-2">Worked Examples</h2>
    <p className="text-sm text-muted-foreground mb-6">
      Concrete walkthroughs using real names so you know what the output looks like before you try it.
    </p>
    <div className="grid md:grid-cols-3 gap-4">
      {examples.map((e) => (
        <div key={e.input} className="p-5 rounded-xl border border-border bg-card">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Input</p>
          <p className="font-display font-bold text-lg mb-3">{e.input}</p>
          <p className="text-sm text-muted-foreground mb-2">
            <strong className="text-foreground">Finding:</strong> {e.finding}
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Why it matters:</strong> {e.insight}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export interface RelatedTool {
  to: string;
  name: string;
  blurb: string;
}

export const RelatedToolsInline = ({ tools }: { tools: RelatedTool[] }) => (
  <section className="mt-16 p-6 rounded-xl border border-border bg-secondary/30">
    <h2 className="text-xl font-bold mb-4">Related Tools You May Need Next</h2>
    <ul className="space-y-3">
      {tools.map((t) => (
        <li key={t.to} className="flex items-start gap-2">
          <ArrowRight size={16} className="text-primary mt-1 shrink-0" />
          <p className="text-sm">
            <Link to={t.to} className="font-semibold text-primary hover:underline">
              {t.name}
            </Link>
            <span className="text-muted-foreground"> — {t.blurb}</span>
          </p>
        </li>
      ))}
    </ul>
  </section>
);
