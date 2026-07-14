import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
              IJBAHR
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              International Journal of Biochemical and Allied Health Research
            </span>
          </div>

          <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-xs">Contact Us</h3>
            <p>
              <strong>Email:</strong> <br/>
              <a href="mailto:submission@ijbahresearch.com" className="hover:text-emerald-600 transition-colors">submission@ijbahresearch.com</a> <br/>
              <a href="mailto:ijbah.research@gmail.com" className="hover:text-emerald-600 transition-colors">ijbah.research@gmail.com</a>
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
             <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-xs">Affiliations</h3>
             <p>
               <strong>Under the Supervision:</strong><br/> 
               Dept of Biochemistry, University of Karachi
             </p>
             <p>
               <strong>Publisher:</strong><br/> 
               MADAR CHEMICALS, Karachi, Pakistan
             </p>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-8 sm:flex-row">
          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} IJBAHR. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
