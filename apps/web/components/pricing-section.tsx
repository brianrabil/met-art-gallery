"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { meta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import * as React from "react";

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Pricing Section
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

export interface PricingTier {
	name: string;
	price: {
		monthly?: string | number;
		yearly?: string | number;
		once?: string | number;
	};
	description: string;
	features: string[];
	cta: string;
	highlighted?: boolean;
	popular?: boolean;
}

interface PricingSectionProps {
	title?: string;
	subtitle?: string;
	tiers?: PricingTier[];
}

const PAYMENT_FREQUENCIES = ["monthly", "yearly"] as Array<
	keyof PricingTier["price"]
>;

export function PricingSection({
	title = "Pricing",
	subtitle = "Choose the plan that fits your needs",
	tiers = meta.pricing.tiers,
}: PricingSectionProps) {
	const [selectedFrequency, setSelectedFrequency] = React.useState<
		keyof PricingTier["price"]
	>(PAYMENT_FREQUENCIES[0]);

	return (
		<section className="flex flex-col items-center gap-10 py-10">
			<div className="space-y-7 text-center">
				<div className="space-y-4">
					<h1 className="font-serif text-4xl font-medium md:text-5xl">
						{title}
					</h1>
					<p className="text-muted-foreground">{subtitle}</p>
				</div>
				<div className="mx-auto flex w-fit rounded-full bg-muted p-1">
					{PAYMENT_FREQUENCIES.map((freq) => (
						<Tab
							key={freq}
							text={freq}
							selected={selectedFrequency === freq}
							setSelected={setSelectedFrequency}
							discount={freq === "yearly"}
						/>
					))}
				</div>
			</div>

			<div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
				{tiers.map((tier) => (
					<PricingCard
						key={tier.name}
						tier={tier}
						paymentFrequency={selectedFrequency}
					/>
				))}
			</div>
		</section>
	);
}

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Pricing Card
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

interface PricingCardProps {
	tier: PricingTier;
	paymentFrequency: keyof PricingTier["price"];
}

function PricingCard({ tier, paymentFrequency = "yearly" }: PricingCardProps) {
	const price = tier.price[paymentFrequency];
	const isHighlighted = tier.highlighted;
	const isPopular = tier.popular;

	return (
		<Card
			className={cn(
				"relative flex flex-col gap-8 overflow-hidden p-6",
				isHighlighted
					? "bg-foreground text-background"
					: "bg-background text-foreground",
				isPopular && "ring-2 ring-primary",
			)}
		>
			{isHighlighted && <HighlightedBackground />}
			{isPopular && <PopularBackground />}

			<h2 className="flex font-serif items-center gap-3 text-xl font-medium capitalize">
				{tier.name}
				{isPopular && (
					<Badge variant="secondary" className="mt-1 z-10">
						🔥 Most Popular
					</Badge>
				)}
			</h2>

			<div className="relative h-12">
				{typeof price === "number" ? (
					<>
						<NumberFlow
							format={{
								style: "currency",
								currency: "USD",
								trailingZeroDisplay: "stripIfInteger",
							}}
							value={price}
							className="text-4xl font-medium"
						/>
						<p className="-mt-2 text-xs text-muted-foreground">
							Per month/user
						</p>
					</>
				) : (
					<h1 className="text-4xl font-medium">{price}</h1>
				)}
			</div>

			<div className="flex-1 space-y-2">
				<h3 className="text-sm font-medium">{tier.description}</h3>
				<ul className="space-y-2">
					{tier.features.map((feature, index) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className={cn(
								"flex items-center gap-2 text-sm font-medium",
								isHighlighted ? "text-background" : "text-muted-foreground",
							)}
						>
							<BadgeCheck className="h-4 w-4" />
							{feature}
						</li>
					))}
				</ul>
			</div>

			<Button
				variant={isHighlighted ? "secondary" : "default"}
				className="w-full"
			>
				{tier.cta}
				<ArrowRight className="ml-2 h-4 w-4" />
			</Button>
		</Card>
	);
}

const HighlightedBackground = () => (
	<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
);

const PopularBackground = () => (
	<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
);

// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
// Pricing Tab
// ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

interface TabProps {
	text: keyof PricingTier["price"];
	selected: boolean;
	setSelected: (frequency: keyof PricingTier["price"]) => void;
	discount?: boolean;
}

function Tab({ text, selected, setSelected, discount = false }: TabProps) {
	return (
		<button
			type="button"
			onClick={() => setSelected(text)}
			className={cn(
				"relative w-fit px-4 py-2 text-sm font-semibold capitalize",
				"text-foreground transition-colors",
				discount && "flex items-center justify-center gap-2.5",
			)}
		>
			<span className="relative z-10">{text}</span>
			{selected && (
				<motion.span
					layoutId="tab"
					transition={{ type: "spring", duration: 0.4 }}
					className="absolute inset-0 z-0 rounded-full bg-background shadow-sm"
				/>
			)}
			{discount && (
				<Badge
					variant="secondary"
					className={cn(
						"relative z-10 whitespace-nowrap shadow-none",
						selected && "bg-muted",
					)}
				>
					Save 35%
				</Badge>
			)}
		</button>
	);
}
