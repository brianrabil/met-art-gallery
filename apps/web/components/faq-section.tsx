import { meta } from "@/lib/meta";
import { Container } from "./container";

export interface FAQItem {
	id: number;
	question: string;
	answer: string;
}

export function FAQSection({
	faqs = meta.faqs,
}: {
	faqs?: FAQItem[];
}) {
	return (
		<div className="bg-background">
			<Container className="py-16 sm:py-24">
				<h2 className="text-4xl font-serif font-semibold tracking-tight text-foreground sm:text-5xl">
					Frequently asked questions
				</h2>
				<p className="mt-6 max-w-2xl text-base text-muted-foreground">
					Have a different question and can’t find the answer you’re looking
					for? Reach out to our support team by{" "}
					<a
						href={`mailto:${meta.contact.email}`}
						className="font-semibold text-primary hover:underline"
					>
						sending us an email
					</a>{" "}
					and we’ll get back to you as soon as we can.
				</p>
				<div className="mt-20">
					<dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
						{faqs?.map((faq) => (
							<div key={faq.id}>
								<dt className="text-base font-semibold text-foreground">
									{faq.question}
								</dt>
								<dd className="mt-2 text-base text-muted-foreground">
									{faq.answer}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</Container>
		</div>
	);
}
