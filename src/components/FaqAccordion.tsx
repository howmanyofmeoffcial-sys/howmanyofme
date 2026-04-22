"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqGroup {
  category: string;
  items: FaqItem[];
}

interface FaqAccordionProps {
  groups: FaqGroup[];
}

const FaqAccordion = ({ groups }: FaqAccordionProps) => (
  <div className="max-w-3xl mx-auto space-y-10">
    {groups.map((group, gi) => (
      <div key={group.category}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            {String(gi + 1).padStart(2, "0")} · {group.category}
          </span>
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{group.items.length} questions</span>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {group.items.map((faq, i) => (
            <AccordionItem
              key={`${group.category}-${i}`}
              value={`faq-${group.category}-${i}`}
              className="border border-border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    ))}
  </div>
);

export default FaqAccordion;
