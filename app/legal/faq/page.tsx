import React from 'react';

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">What is this website about?</h2>
          <p>
            This website is a platform to provide information and resources about our services and products.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">How can I contact support?</h2>
          <p>
            You can contact our support team by emailing <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a>.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Where can I find the documentation?</h2>
          <p>
            Documentation is available in the <a href="/docs" className="text-blue-600 underline">Docs</a> section of our website.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Is there a free trial available?</h2>
          <p>
            Yes, we offer a 14-day free trial for new users. Sign up to get started!
          </p>
        </section>
      </div>
    </div>
  );
}
