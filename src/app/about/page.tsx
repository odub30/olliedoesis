// src/app/about/page.tsx
import { Code, Shield, Laptop, BookOpen, Award, MapPin } from 'lucide-react';

export default function AboutPage() {
  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'Express', 'REST APIs', 'Database Design'] },
    { category: 'Cybersecurity', items: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Security Auditing'] },
    { category: 'Tools', items: ['Git', 'VS Code', 'Linux', 'Docker', 'Figma'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Me</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Passionate web developer and cybersecurity student dedicated to creating secure, 
            user-friendly digital experiences while protecting the digital world.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Introduction */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Hi, I'm Ollie! 👋</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  I'm a web developer with a passion for cybersecurity, combining creativity with 
                  security-first thinking to build robust digital solutions. Currently pursuing my 
                  studies in cybersecurity while developing modern web applications.
                </p>
                <p>
                  My journey started with curiosity about how websites work, which led me down the 
                  rabbit hole of web development. Along the way, I became fascinated with the security 
                  aspects of the digital world and decided to specialize in cybersecurity as well.
                </p>
                <p>
                  When I'm not coding or studying security protocols, you can find me exploring new 
                  technologies, contributing to open source projects, or learning about the latest 
                  cybersecurity threats and defenses.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Based in Henderson NV</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Web Developer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Cybersecurity Student</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Continuous Learner</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Skills & Technologies</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillGroup, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                  {skillGroup.category === 'Frontend' && <Laptop className="h-5 w-5 mr-2 text-blue-600" />}
                  {skillGroup.category === 'Backend' && <Code className="h-5 w-5 mr-2 text-green-600" />}
                  {skillGroup.category === 'Cybersecurity' && <Shield className="h-5 w-5 mr-2 text-red-600" />}
                  {skillGroup.category === 'Tools' && <Award className="h-5 w-5 mr-2 text-purple-600" />}
                  {skillGroup.category}
                </h3>
                <ul className="space-y-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <li key={skillIndex} className="text-gray-600 text-sm">{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Experience */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Education</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-lg text-gray-800">Cybersecurity Studies</h3>
                  <p className="text-blue-600 font-medium">Comptia Security Plus</p>
                  <p className="text-gray-500 text-sm mb-3">2024 - Present</p>
                  <p className="text-gray-600 text-sm">
                    Focusing on network security, ethical hacking, risk management, and digital forensics.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-lg text-gray-800">Self-Taught Development</h3>
                  <p className="text-blue-600 font-medium">Online Learning & Projects</p>
                  <p className="text-gray-500 text-sm mb-3">Ongoing</p>
                  <p className="text-gray-600 text-sm">
                    Continuously learning through courses, documentation, and hands-on projects.
                  </p>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Experience</h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-lg text-gray-800">Web Development Projects</h3>
                  <p className="text-blue-600 font-medium">Personal & Client Work</p>
                  <p className="text-gray-500 text-sm mb-3">2024 - Present</p>
                  <p className="text-gray-600 text-sm">
                    Building responsive web applications using modern frameworks and best practices.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold text-lg text-gray-800">Security Research</h3>
                  <p className="text-blue-600 font-medium">Academic & Personal Projects</p>
                  <p className="text-gray-500 text-sm mb-3">2024 - Present</p>
                  <p className="text-gray-600 text-sm">
                    Conducting security assessments and staying current with cybersecurity trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Goals & Interests */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Goals & Interests</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Full-Stack Development</h3>
              <p className="text-gray-600 text-sm">
                Building end-to-end web applications with modern technologies and best practices.
              </p>
            </div>
            <div>
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Cybersecurity Career</h3>
              <p className="text-gray-600 text-sm">
                Pursuing a career in cybersecurity to help protect organizations and individuals.
              </p>
            </div>
            <div>
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-800 mb-2">Continuous Learning</h3>
              <p className="text-gray-600 text-sm">
                Always exploring new technologies and staying current with industry trends.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}