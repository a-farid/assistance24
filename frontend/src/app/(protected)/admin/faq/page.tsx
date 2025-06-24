"use client";
import { FAQ_LIST_EN, FAQ_LIST_DE } from "@/lib/constants/faq_list";
import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import { useLocale, useTranslations } from "next-intl";



const Faq = () => {
  const [search, setSearch] = useState("");
  const t = useTranslations('FaqPage');
  
    const locale = useLocale();
    const FAQ_LIST = locale === "de" ? FAQ_LIST_DE : FAQ_LIST_EN;
    const filteredFaqs = FAQ_LIST.filter((faq) =>
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
      <input
        type="text"
        placeholder={t('searchMsg')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border rounded"
      />

      {filteredFaqs.length === 0 ? (
        <p className="text-gray-500">No matching questions found.</p>
      ) : (
        filteredFaqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold text-lg text-blue-600 dark:text-blue-200">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-white">{faq.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
        ))
      )}
    </div>
  );
};

export default Faq;
