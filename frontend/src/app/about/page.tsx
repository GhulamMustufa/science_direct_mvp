import { User, ShieldCheck, GraduationCap } from "lucide-react";
import Image from "next/image";

const editorialBoard = [
  { name: "Prof. Syed A Aziz", affiliation: "Faculty of Medicine, Department of Pathology and Lab Medicine, University of Ottawa, Canada.", image: "/images/editorial/syed_a_aziz.jpeg" },
  { name: "Prof. Bilquees Gul", affiliation: "Ex Director, Dr Ajmal Khan Institute of Sustainable Halophytes Utilization, University of Karachi", image: "/images/editorial/bilquees_gul.jpeg" },
  { name: "Prof. Maqsood Ansari", affiliation: "Department of Genetics, University of Karachi", image: "/images/editorial/maqsood_ansari.jpeg" },
  { name: "Prof. Hamida Nusrat", affiliation: "PhD, PHM, SM(ASCP), MLS(ASCPi), TS(ABB), Professor, UC Berkeley, California USA.", image: "/images/editorial/hamida_nusrat.jpeg" },
  { name: "Prof. Urszula Guzik", affiliation: "Department of Biochemistry, Faculty of Biology and Environmental Protection, University of Silesia, Katowice. Poland", image: "/images/editorial/urszula_guzik.jpg" },
  { name: "Dr. Raffat Sultana", affiliation: "Executive Director, Karachi Institute of Heart Diseases", image: "/images/editorial/raffat_sultana.png" },
  { name: "Prof. Zamin Shaheed Siddiqui", affiliation: "MAHQ Biological Research Centre, University of Karachi, Pakistan", image: "/images/editorial/zamin_shaheed_siddiqui.jpeg" },
  { name: "Prof. Tabassum Mahboob", affiliation: "Meritorious Professor of Biochemistry, former Dean Faculty of Science, University of Karachi", image: "/images/editorial/tabassum_mahboob.jpeg" },
  { name: "Prof. S. M. Shahid", affiliation: "School of Health Science Eastern Institute of Technology, Auckland University, New Zealand", image: "/images/editorial/s_m_shahid.jpeg" },
  { name: "Prof. Farah Jabeen", affiliation: "Department of Biochemistry, Jinnah Women University for Women, Karachi, Pakistan", image: "/images/editorial/farah_jabeen.jpeg" },
  { name: "Prof. Shamim A Qureshi", affiliation: "Department of Biochemistry, University of Karachi, Pakistan.", image: "/images/editorial/shamim_a_qureshi.jpeg" },
  { name: "Prof. Afsheen Aman", affiliation: "The Karachi institute of Biotechnology and Genetic Engineering (KIBGE). University of Karachi, Pakistan.", image: "/images/editorial/afsheen_aman.png" },
  { name: "Prof. Junaid Mahmood Alam", affiliation: "Head of clinical biochemistry and chemical Pathology lab services, Liaquat National Hospital and medical college, Karachi", image: "/images/editorial/junaid_mahmood_alam.jpeg" },
  { name: "Prof. Qudsia Tariq", affiliation: "Department of Psychology, University of Karachi, Pakistan.", image: "/images/editorial/qudsia_tariq.jpeg" },
  { name: "Prof. Zaheer Ul Haq", affiliation: "Dr. Panjwani Center for Molecular Medicine & Drug Research (ICCBS). University of Karachi, Pakistan.", image: "/images/editorial/zaheer_ul_haq.jpeg" },
  { name: "Prof. Aliya Riaz", affiliation: "Department of Biochemistry, Jinnah University for Women, Karachi, Pakistan", image: "/images/editorial/aliya_riaz.jpeg" },
  { name: "Dr. Muhammad Asif Nawaz", affiliation: "Department of Biotechnology, Shaheed Benazir Bhutto University, KPK, Pakistan.", image: "/images/editorial/muhammad_asif_nawaz.jpeg" }
];

const advisoryBoard = [
  { name: "Dr. Muhammad Mohtasheemul Hasan", affiliation: "University of Karachi, Karachi, Pakistan" },
  { name: "Dr. S. M. Shahid", affiliation: "School of Health Science Eastern Institute of Technology, Auckland University, New Zealand" },
  { name: "Dr. Hamida Nusrat", affiliation: "Professor, UC Berkeley, California USA" },
  { name: "Dr. Maqsood Ali Ansari", affiliation: "Department of Genetics, University of Karachi" },
  { name: "Dr. Ileana Cornelia Farcasanu", affiliation: "Bucharest University, Bucharest, Romania" },
  { name: "Dr. Urszula Guzik", affiliation: "Faculty of Biology and Environmental Protection, University of Silesia, Katowice. Poland" },
  { name: "Dr. Afsheen Aman", affiliation: "KIBGE, University of Karachi, Pakistan" },
  { name: "Dr. Zaheer Ul-Haq", affiliation: "ICCBS, University of Karachi" },
  { name: "Dr. Basit Ansari", affiliation: "Department of Health, Physical Education and Sports Sciences, University of Karachi" },
  { name: "Dr. Raheela Rahmat Zohra", affiliation: "Department of Biotechnology, University of Karachi, Pakistan" },
  { name: "Dr. Sidra Pervez", affiliation: "Shaheed Benazir Bhutto Women University (SBBWU), Peshawar, Pakistan" },
  { name: "Dr. Farhat Batool", affiliation: "Department of Biochemistry, University of Karachi" },
  { name: "Dr. Aiman Umer", affiliation: "Shaheed Benazir Bhutto Women University (SBBWU), Peshawar, Pakistan" },
  { name: "Dr. Saba Memon", affiliation: "Pakistan Institute of Rehabilitation and Medical Sciences, Karachi, Pakistan" },
  { name: "Dr. Sadia Saleem", affiliation: "Department of Biochemistry, University of Karachi, Pakistan" },
  { name: "Dr. Junaid Mahmood Alam", affiliation: "Department of Clinical Biochemistry LNH and Medical College, Karachi-Pakistan" },
  { name: "Dr. Samina Khan", affiliation: "Jinnah University for Women, Karachi, Pakistan" },
  { name: "Dr. Syeda Ariba Shoaib", affiliation: "Pakistan Institute of Rehabilitation and Medical Sciences, Karachi, Pakistan" },
  { name: "Dr. Nimra Baig", affiliation: "Bhitai Institute of Management Science & Technology, Mirpurkhas, Sindh, Pakistan" },
  { name: "Mr. Mohsin Khan", affiliation: "Ohio University Athens, USA" }
];

function ProfileCard({ name, affiliation, image }: { name: string, affiliation: string, image?: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="h-24 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-500 overflow-hidden relative">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" unoptimized />
        ) : (
          <User size={32} />
        )}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{name}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{affiliation}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Header */}
      <section className="bg-emerald-900 text-emerald-50 py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-emerald-200 max-w-2xl mx-auto">
            Meet the distinguished experts and academics leading the International Journal of Biochemical and Allied Health Research.
          </p>
        </div>
      </section>

      {/* Editor in Chief */}
      <section className="container mx-auto max-w-7xl px-4 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Editor-In-Chief</h2>
        </div>
        <div className="max-w-md">
          <ProfileCard 
            name="Prof. Shah Ali Ul Qader" 
            affiliation="University of Karachi, Pakistan" 
            image="/images/editorial/shah_ali_ul_qader.jpeg"
          />
        </div>
      </section>

      {/* Editorial Board */}
      <section className="container mx-auto max-w-7xl px-4 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Editorial Board</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {editorialBoard.map((member, index) => (
            <ProfileCard key={index} name={member.name} affiliation={member.affiliation} image={member.image} />
          ))}
        </div>
      </section>

      {/* Advisory Board */}
      <section className="container mx-auto max-w-7xl px-4 mt-20">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="text-emerald-600" size={32} />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Advisory Board</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {advisoryBoard.map((member, index) => (
            <ProfileCard key={index} name={member.name} affiliation={member.affiliation} />
          ))}
        </div>
      </section>
    </div>
  );
}
