import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X, Github, Linkedin, Mail, ExternalLink, Code2, Database, BrainCircuit } from 'lucide-react';
import fsFE from '../../assets/images/fs-fe.jpg';
import fsBE from '../../assets/images/fs-be.jpeg';

const OurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: "fs-1",
      name: "Refaldi Julidinsyah",
      role: "Fullstack Developer",
      roleIcon: Code2,
      roleColor: "text-blue-500",
      roleBg: "bg-blue-500/10",
      roleBorder: "border-blue-500/20",
      university: "Universitas Lancang Kuning",
      major: "Teknik Informatika",
      semester: 4,
      photo: fsFE,
      bio: "Bertanggung jawab atas arsitektur frontend dan integrasi backend. Fokus pada performa dan UX aplikasi Sipangan.",
      socials: {
        github: "https://github.com/rfldisyah",
        linkedin: "https://www.linkedin.com/in/refaldi-julidinsyah-06320a278",
        email: "mailto:syahrefaldi@gmail.com"
      }
    },
    {
      id: "fs-2",
      name: "Labib Abdullah",
      role: "Fullstack Developer",
      roleIcon: Code2,
      roleColor: "text-blue-500",
      roleBg: "bg-blue-500/10",
      roleBorder: "border-blue-500/20",
      university: "Universitas Lancang Kuning",
      major: "Teknik Informatika",
      semester: 4,
      photo: fsBE,
      bio: "Menangani pengembangan API, database design, dan state management aplikasi berbasis React dan Node.js.",
      socials: {
        github: "https://github.com/LabibAbdullah1",
        linkedin: "https://www.linkedin.com/in/labib-abdullah",
        email: "mailto:labibabdullahhasan@gmail.com"
      }
    },
    {
      id: "ds-1",
      name: "Alan Turing",
      role: "Data Scientist",
      roleIcon: Database,
      roleColor: "text-emerald-500",
      roleBg: "bg-emerald-500/10",
      roleBorder: "border-emerald-500/20",
      university: "Universitas Gadjah Mada",
      major: "Ilmu Komputer",
      semester: 8,
      photo: "https://ui-avatars.com/api/?name=Alan+Turing&background=10B981&color=fff&size=256",
      bio: "Ahli dalam analisis data spasial (TopoJSON) dan pembersihan data historis harga pangan untuk prediksi masa depan.",
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:alan@example.com"
      }
    },
    {
      id: "ds-2",
      name: "Ada Lovelace",
      role: "Data Scientist",
      roleIcon: Database,
      roleColor: "text-emerald-500",
      roleBg: "bg-emerald-500/10",
      roleBorder: "border-emerald-500/20",
      university: "Universitas Indonesia",
      major: "Matematika",
      semester: 8,
      photo: "https://ui-avatars.com/api/?name=Ada+Lovelace&background=10B981&color=fff&size=256",
      bio: "Membuat visualisasi data tingkat lanjut (Recharts) dan analisis statistik terkait fluktuasi harga komoditas.",
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:ada@example.com"
      }
    },
    {
      id: "ai-1",
      name: "Andrew Ng",
      role: "AI Engineer",
      roleIcon: BrainCircuit,
      roleColor: "text-amber-500",
      roleBg: "bg-amber-500/10",
      roleBorder: "border-amber-500/20",
      university: "Institut Teknologi Bandung",
      major: "Teknik Informatika",
      semester: 7,
      photo: "https://ui-avatars.com/api/?name=Andrew+Ng&background=F59E0B&color=fff&size=256",
      bio: "Merancang model Machine Learning untuk Early Warning System dan deteksi anomali pada data harga pangan.",
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:andrew@example.com"
      }
    },
    {
      id: "ai-2",
      name: "Fei-Fei Li",
      role: "AI Engineer",
      roleIcon: BrainCircuit,
      roleColor: "text-amber-500",
      roleBg: "bg-amber-500/10",
      roleBorder: "border-amber-500/20",
      university: "Universitas Airlangga",
      major: "Sistem Informasi",
      semester: 7,
      photo: "https://ui-avatars.com/api/?name=Fei-Fei+Li&background=F59E0B&color=fff&size=256",
      bio: "Fokus pada integrasi pipeline AI/ML ke backend dan memonitor akurasi prediksi kelangkaan komoditas secara real-time.",
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:feifei@example.com"
      }
    }
  ];

  // Helper to chunk array for different rows
  const fullstackData = teamMembers.filter(m => m.role.includes('Fullstack'));
  const dsData = teamMembers.filter(m => m.role.includes('Data Scientist'));
  const aiData = teamMembers.filter(m => m.role.includes('AI Engineer'));

  const TeamSection = ({ title, members }) => (
    <div className="mb-20 max-w-5xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="flex-1 max-w-[100px] md:max-w-[150px] h-px bg-gradient-to-l from-white/10 to-transparent hidden sm:block"></div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest text-center">{title}</h3>
        <div className="flex-1 max-w-[100px] md:max-w-[150px] h-px bg-gradient-to-r from-white/10 to-transparent hidden sm:block"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {members.map((member, index) => {
          const Icon = member.roleIcon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="group cursor-pointer relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]"></div>
              <div className="p-4 sm:p-6 bg-gray-900/40 backdrop-blur-xl border border-white/5 rounded-3xl sm:rounded-[2rem] hover:border-white/10 transition-all duration-300 flex flex-col h-full relative overflow-hidden z-10 group-hover:-translate-y-1 group-hover:shadow-2xl">
                
                {/* Background glow based on role */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-10 group-hover:opacity-20 transition-opacity ${member.roleBg}`}></div>

                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Photo */}
                  <div className="relative shrink-0">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 group-hover:${member.roleBorder} transition-colors`}>
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className={`absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${member.roleBg} ${member.roleColor} border ${member.roleBorder} flex items-center justify-center backdrop-blur-sm shadow-lg`}>
                      <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${member.roleColor.replace('text', 'bg')}`}></span>
                      {member.role}
                    </div>
                    <h4 className="text-xl font-black text-white tracking-tight mb-1">{member.name}</h4>
                    <p className="text-sm font-medium text-gray-500 line-clamp-1">{member.university}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <section className="relative pt-10 pb-10 border-b border-white/5 flex flex-col items-center text-center">
        <div className="max-w-4xl px-4 md:px-0 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Users size={12} fill="currentColor" /> The Developers
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1] mb-6">
            Tim Capstone <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Sipangan.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-2xl leading-relaxed">
            Mengenal lebih dekat 6 mahasiswa di balik inovasi Sistem Informasi Ketahanan Pangan (SIPANGAN) untuk program Coding Camp 2026.
          </p>
        </div>
      </section>

      <section className="pt-8">
        <TeamSection title="Fullstack Team" members={fullstackData} />
        <TeamSection title="Data Science Team" members={dsData} />
        <TeamSection title="AI Engineering Team" members={aiData} />
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
              className="fixed top-1/2 left-1/2 w-full max-w-lg z-[9999] px-4"
            >
              <div className="bg-gray-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                {/* Modal Header/Cover */}
                <div className="h-32 bg-gradient-to-br from-gray-900 to-gray-950 relative border-b border-white/5">
                  <div className={`absolute inset-0 opacity-20 ${selectedMember.roleBg}`}></div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/50 hover:text-white transition-colors border border-white/10 backdrop-blur-md"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
                  {/* Floating Avatar */}
                  <div className="absolute -top-16 left-6 sm:left-8">
                    <div className={`w-32 h-32 rounded-[2rem] border-4 border-gray-950 overflow-hidden bg-gray-900`}>
                      <img src={selectedMember.photo} alt={selectedMember.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="pt-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white mb-4">
                      <selectedMember.roleIcon size={12} className={selectedMember.roleColor} />
                      {selectedMember.role}
                    </div>
                    
                    <h3 className="text-3xl font-black text-white tracking-tight mb-2">{selectedMember.name}</h3>
                    
                    <div className="space-y-4 mt-6">
                      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Asal Kampus</span>
                          <span className="text-sm font-medium text-white">{selectedMember.university}</span>
                        </div>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jurusan</span>
                          <span className="text-sm font-medium text-white">{selectedMember.major}</span>
                        </div>
                        <div className="h-px bg-white/5"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Semester</span>
                          <span className="text-sm font-black text-emerald-400">{selectedMember.semester}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tentang</h4>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {selectedMember.bio}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <a href={selectedMember.socials.github} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white transition-colors border border-white/5 hover:border-white/10">
                          <Github size={16} /> GitHub
                        </a>
                        <a href={selectedMember.socials.linkedin} className="flex-1 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-blue-400 transition-colors border border-blue-500/10 hover:border-blue-500/20">
                          <Linkedin size={16} /> LinkedIn
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OurTeam;
