import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Transparent answers for a transparent platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem
            value="item-1"
            className="rounded-lg border border-gray-200 bg-white px-6"
          >
            <AccordionTrigger className="text-gray-900 hover:text-gray-700">
              Is CareerForge really 100% free?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, CareerForge is completely free for job seekers. We make money
              through partnerships with companies looking to hire talent, not by
              charging users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-2"
            className="rounded-lg border border-gray-200 bg-white px-6"
          >
            <AccordionTrigger className="text-gray-900 hover:text-gray-700">
              How do you make money if it's free?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              We partner with top companies who are looking to find great
              talent. This allows us to keep the core tools completely free for
              job seekers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-3"
            className="rounded-lg border border-gray-200 bg-white px-6"
          >
            <AccordionTrigger className="text-gray-900 hover:text-gray-700">
              Can I download my resume as a PDF?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, you can download your resume as a PDF or Word document at any
              time from your account.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="item-4"
            className="rounded-lg border border-gray-200 bg-white px-6"
          >
            <AccordionTrigger className="text-gray-900 hover:text-gray-700">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Yes, we use enterprise-grade security to protect your data. Your
              resume is only visible to employers you choose to share it with.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
