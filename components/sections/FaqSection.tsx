import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqs } from "@/lib/faqs"

export function FaqSection() {
  return (
    <section className="bg-[#f7f1e7] py-20">
      <div className="container-premium grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">FAQ</p>
          <h2 className="mt-5 font-heading text-4xl font-medium">Domande frequenti</h2>
        </div>
        <Accordion className="divide-y divide-border">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="py-5 font-heading text-2xl font-normal hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-7 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
