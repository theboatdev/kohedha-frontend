import { FaqSection } from "@/components/brand/faq-section";
import { FAQS } from "./data";

export function Faq() {
  return (
    <FaqSection
      id="faq"
      kicker="Questions"
      title="Good to *know.*"
      intro="The short version: it's free, it's private, and you only hear from the venue that wins."
      items={FAQS}
    />
  );
}
