import { BookOpen, FileCheck, Users, Upload, CheckCircle2, ShieldCheck, PenTool } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 pb-24 bg-white dark:bg-zinc-950">
      {/* Header */}
      <section className="bg-emerald-900 text-emerald-50 py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">About Us & How We Work</h1>
          <p className="text-lg text-emerald-200 max-w-2xl mx-auto">
            Discover our editorial process, author guidelines, and the journey of a manuscript from submission to publication.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="container mx-auto max-w-4xl px-4 mt-16">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">How We Work</h2>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300">
          <p className="text-lg leading-relaxed mb-4">
            At the International Journal of Biochemical and Allied Health Research (IJBAHR), our core mission is to foster academic excellence by providing a rigorous, transparent, and swift peer-review process. We believe that groundbreaking research deserves a platform that respects the hard work of scientists, clinicians, and researchers worldwide. 
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our editorial framework is built upon the principles of academic integrity and collaborative growth. Once a manuscript is submitted to our platform, it undergoes a meticulous evaluation by our Editor-in-Chief, followed by double-blind peer review conducted by esteemed members of our Editorial and Advisory Boards. This ensures that every piece of published research meets the highest standards of scientific validity and relevance.
          </p>
        </div>
      </section>

      {/* The User Journey / Flow */}
      <section className="container mx-auto max-w-4xl px-4 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">The Author Journey</h2>
        </div>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent">
          
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <Upload size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">1. Initial Submission</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Authors create an account and submit their manuscript along with the required metadata. The initial screening ensures the document adheres to formatting guidelines and falls within the journal's scope.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <ShieldCheck size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">2. Peer Review</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                The manuscript is assigned to domain experts for a double-blind peer review. Reviewers assess the methodology, originality, and significance of the research, providing constructive feedback.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <PenTool size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">3. Revisions & Decision</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Based on reviewer feedback, the Editor makes a decision (Accept, Minor/Major Revisions, or Reject). Authors are given the opportunity to address concerns and upload revised documents.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
              <CheckCircle2 size={18} />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">4. Publication</h3>
              </div>
              <p className="text-emerald-800/80 dark:text-emerald-300">
                Upon final acceptance, the manuscript is formatted and published in the upcoming journal volume. It becomes immediately accessible to the global scientific community.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Submission Guidelines */}
      <section className="container mx-auto max-w-4xl px-4 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <FileCheck className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Document Guidelines</h2>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Formatting Rules</h3>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400 mb-8 list-disc list-inside">
            <li>Manuscripts must be submitted exclusively in <strong className="text-zinc-800 dark:text-zinc-200">PDF format</strong> via the online submission portal.</li>
            <li>Use standard fonts (e.g., Times New Roman, Arial) at 12-point size with double spacing throughout the text.</li>
            <li>The title page should include the article title, author names, affiliations, and contact information of the corresponding author.</li>
            <li>Abstracts must not exceed 250 words and should be followed by 3-5 relevant keywords.</li>
            <li>All figures and tables should be embedded within the text near their first citation.</li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Ethical Standards</h3>
          <ul className="space-y-3 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>Plagiarism in any form is strictly prohibited. All submissions are screened for similarity.</li>
            <li>Authors must declare any potential conflicts of interest at the time of submission.</li>
            <li>Research involving human or animal subjects must include a statement of ethical approval from the relevant institutional committee.</li>
            <li>Only original work that has not been published or is under consideration elsewhere will be accepted.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
