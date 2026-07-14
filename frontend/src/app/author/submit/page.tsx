"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService } from "@/features/author/services/author.service";
import { submissionValidator } from '@/features/author/validation/SubmissionValidator';
import { AuthorData } from '@/features/author/validation/validators/AuthorValidator';
import { Plus, X, User } from "lucide-react";

export default function SubmitArticlePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [section, setSection] = useState("");
  const [language, setLanguage] = useState("English");

  const [authors, setAuthors] = useState<AuthorData[]>([{
    firstName: "", lastName: "", email: "", affiliation: "", isCorresponding: true
  }]);
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [checklist, setChecklist] = useState({
    originality: false,
    format: false,
    references: false,
    styling: false,
    ethics: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleCheckboxChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };



  const addAuthor = () => {
    setAuthors([...authors, { firstName: "", lastName: "", email: "", affiliation: "", isCorresponding: false }]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = [...authors];
      newAuthors.splice(index, 1);
      
      // Ensure there's still a corresponding author
      if (!newAuthors.some(a => a.isCorresponding)) {
        newAuthors[0].isCorresponding = true;
      }
      setAuthors(newAuthors);
    }
  };

  const updateAuthor = (index: number, field: keyof AuthorData, value: string | boolean) => {
    const newAuthors = [...authors];
    
    if (field === "isCorresponding" && value === true) {
      // Only one corresponding author allowed for now
      newAuthors.forEach(a => a.isCorresponding = false);
    }
    
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = submissionValidator.validateSubmission({
      section,
      language,
      authors,
      file: pdfFile,
      checklist,
    });

    if (!validationResult.isValid) {
      setError(validationResult.errors.map(err => err.message).join('\n'));
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("section", section);
      formData.append("language", language);
      formData.append("authors", JSON.stringify(authors));
      formData.append("pdf", pdfFile!);

      await authorService.submitArticle(formData);
      router.push("/author"); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Failed to submit article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Submit New Article
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Provide your manuscript details, list authors, confirm you meet all academic requirements, and upload your manuscript.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium whitespace-pre-wrap">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            1. Manuscript Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Journal Section <span className="text-red-500">*</span>
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
              >
                <option value="" disabled>Select Section</option>
                <option value="Research Article">Research Article</option>
                <option value="Review">Review</option>
                <option value="Case Report">Case Report</option>
                <option value="Short Communication">Short Communication</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
              >
                <option value="English">English</option>
                <option value="Spanish" disabled>Spanish (Coming Soon)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
              2. Authors
            </h2>
            <button
              type="button"
              onClick={addAuthor}
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus size={16} /> Add Author
            </button>
          </div>
          
          <div className="space-y-6">
            {authors.map((author, index) => (
              <div key={index} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-md relative bg-zinc-50 dark:bg-zinc-800/50">
                {authors.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeAuthor(index)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 focus:outline-none transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
                
                <h3 className="text-sm font-semibold mb-4 text-zinc-800 dark:text-zinc-200">
                  Author {index + 1} {author.isCorresponding && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Corresponding</span>}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">First Name</label>
                    <input
                      type="text"
                      value={author.firstName}
                      onChange={(e) => updateAuthor(index, 'firstName', e.target.value)}
                      className="block w-full rounded-md border border-zinc-300 px-3 py-1.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={author.lastName}
                      onChange={(e) => updateAuthor(index, 'lastName', e.target.value)}
                      className="block w-full rounded-md border border-zinc-300 px-3 py-1.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={author.email}
                      onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                      className="block w-full rounded-md border border-zinc-300 px-3 py-1.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Affiliation</label>
                    <input
                      type="text"
                      value={author.affiliation}
                      onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                      className="block w-full rounded-md border border-zinc-300 px-3 py-1.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
                      placeholder="University, Institute, etc."
                    />
                  </div>
                  <div className="col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={author.isCorresponding}
                        onChange={(e) => updateAuthor(index, 'isCorresponding', e.target.checked)}
                        disabled={author.isCorresponding}
                        className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Make Corresponding Author</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            3. Submission Checklist & Rules
          </h2>
          <p className="text-xs text-zinc-500">
            Please read and check all requirements below to confirm compliance:
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.originality}
                onChange={() => handleCheckboxChange("originality")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Originality:</strong> The submission has not been previously published, nor is it before another journal for consideration.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.format}
                onChange={() => handleCheckboxChange("format")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>File Format:</strong> The submission file is in PDF or Word Document (DOCX) file format.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.references}
                onChange={() => handleCheckboxChange("references")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>References:</strong> Where available, URLs or DOIs for the references have been provided.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.styling}
                onChange={() => handleCheckboxChange("styling")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Style & Layout:</strong> The text is double-spaced; uses a 12-point font; employs italics rather than underlining; and all illustrations, figures, and tables are placed within the text.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.ethics}
                onChange={() => handleCheckboxChange("ethics")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Ethics & Disclosure:</strong> All authors have read and approved the submission, and declared any potential conflicts of interest.
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            4. Upload Manuscript
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Manuscript File (PDF or DOCX, max 10MB) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !Object.values(checklist).every(Boolean)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
