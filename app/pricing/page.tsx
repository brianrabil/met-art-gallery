import { FAQSection } from "@/components/faq-section";
import { PricingSection } from "@/components/pricing-section";
import { meta } from "@/lib/meta";

export default function PricingPage() {
	return (
		<>
			<PricingSection
				title="Pricing"
				subtitle="Choose the plan that fits your needs"
				tiers={meta.pricing.tiers}
			/>
			<FAQSection />
		</>
	);
}
