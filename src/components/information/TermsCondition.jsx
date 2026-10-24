"use client";
import LegalPage from "./LegalPage";
import { useTermsConditionQuery } from "@/redux/fetures/information/getTermsCondition";
import { TERMS_OF_USE } from "@/content/legal";

const TermsCondition = () => {
  const { data } = useTermsConditionQuery();
  const doc = data?.data?.attributes;
  return (
    <LegalPage
      title="Terms of use"
      intro="The rules for listing, searching, messaging and paying on MyNextHome."
      adminHtml={doc?.text}
      fallbackHtml={TERMS_OF_USE}
      updatedAt={doc?.updatedAt}
    />
  );
};

export default TermsCondition;
