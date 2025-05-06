import * as React from "react";

export default function HelpCenter() {
 return (
   <>
     <div className="max-w-2xl mx-auto py-12 px-4">
       <h1 className="text-3xl font-bold mb-4">Help Center</h1>
       <p className="mb-8 text-muted-foreground">
         Find answers to common questions or get in touch with our support team.
       </p>
       <div className="space-y-6">
         <div className="rounded-lg border p-6">
           <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
           <ul className="list-disc list-inside space-y-2">
             <li>
               <span className="font-medium">How do I reset my password?</span>
               <div className="text-muted-foreground">
                 Click on "Forgot password" at the login page and follow the instructions.
               </div>
             </li>
             <li>
               <span className="font-medium">Where can I find my account settings?</span>
               <div className="text-muted-foreground">
                 Go to your profile and select "Settings" from the dropdown menu.
               </div>
             </li>
             <li>
               <span className="font-medium">How do I contact support?</span>
               <div className="text-muted-foreground">
                 Use the contact form below or email us at <a href="mailto:support@example.com" className="underline">support@example.com</a>.
               </div>
             </li>
           </ul>
         </div>
         <div className="rounded-lg border p-6">
           <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
           <form className="space-y-4">
             <div>
               <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
               <input
                 id="name"
                 type="text"
                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 placeholder="Your name"
               />
             </div>
             <div>
               <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
               <input
                 id="email"
                 type="email"
                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 placeholder="you@example.com"
               />
             </div>
             <div>
               <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
               <textarea
                 id="message"
                 className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 rows={4}
                 placeholder="How can we help you?"
               />
             </div>
             <button
               type="submit"
               className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
             >
               Send Message
             </button>
           </form>
         </div>
       </div>
     </div>
   </>
 )
}
