import { meta } from "@/lib/meta";
import type { Metadata } from "next";

const { siteName, contact } = meta;

export const metadata: Metadata = {
	title: `Accessibility – ${siteName}`,
	description: "Our commitment to accessibility.",
};

export default function AccessibilityPage() {
	return (
		<>
			<h1 className="text-4xl font-bold">Accessibility Statement</h1>
			<p>
				{siteName} is committed to meeting WCAG 2.1 AA standards. If you
				encounter an accessibility barrier, email{" "}
				<a href={`mailto:${contact.email}`} className="underline">
					{contact.email}
				</a>{" "}
				and we will respond within two business days.
			</p>
		</>
	);
}
