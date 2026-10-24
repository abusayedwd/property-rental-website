"use client";
import LegalPage from "./LegalPage";
import { usePrivacyPolicyQuery } from "@/redux/fetures/information/getProvacy";
import { PRIVACY_POLICY } from "@/content/legal";

const PrivacyPolicy = () => {
  const { data } = usePrivacyPolicyQuery();
  const doc = data?.data?.attributes;
  return (
    <LegalPage
      title="Privacy policy"
      intro="What we collect, why, and how you stay in control of your information."
      adminHtml={doc?.text}
      fallbackHtml={PRIVACY_POLICY}
      updatedAt={doc?.updatedAt}
    />
  );
};

export default PrivacyPolicy;
