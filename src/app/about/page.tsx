// src/app/about/page.tsx
import { Code, Shield, Laptop, BookOpen, Award, MapPin } from 'lucide-react';

export default function AboutPage() {
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Hi, I'm Ollie!</h2>
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
                  <span className="text-gray-700">Based in Henderson, Nevada</span>
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
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <Laptop className="h-5 w-5 mr-2 text-blue-600" />
                Frontend
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">React</li>
                <li className="text-gray-600 text-sm">Next.js</li>
                <li className="text-gray-600 text-sm">TypeScript</li>
                <li className="text-gray-600 text-sm">Tailwind CSS</li>
                <li className="text-gray-600 text-sm">JavaScript</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <Code className="h-5 w-5 mr-2 text-green-600" />
                Backend
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">Node.js</li>
                <li className="text-gray-600 text-sm">Python</li>
                <li className="text-gray-600 text-sm">Express</li>
                <li className="text-gray-600 text-sm">REST APIs</li>
                <li className="text-gray-600 text-sm">Database Design</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-600" />
                Cybersecurity
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">Network Security</li>
                <li className="text-gray-600 text-sm">Penetration Testing</li>
                <li className="text-gray-600 text-sm">Risk Assessment</li>
                <li className="text-gray-600 text-sm">Security Auditing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Tools
              </h3>
              <ul className="space-y-2">
                <li className="text-gray-600 text-sm">Git</li>
                <li className="text-gray-600 text-sm">VS Code</li>
                <li className="text-gray-600 text-sm">Linux</li>
                <li className="text-gray-600 text-sm">Docker</li>
                <li className="text-gray-600 text-sm">Figma</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Education & Goals */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Education & Learning</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Cybersecurity Studies</h3>
                <p className="text-blue-600 font-medium">CompTIA Security+</p>
                <p className="text-gray-500 text-sm mb-3">2024 - Present</p>
                <p className="text-gray-600 text-sm">
                  Focusing on network security, ethical hacking, risk management, and digital forensics.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Self-Taught Development</h3>
                <p className="text-blue-600 font-medium">Continuous Learning</p>
                <p className="text-gray-500 text-sm mb-3">Ongoing</p>
                <p className="text-gray-600 text-sm">
                  Learning through courses, documentation, and hands-on projects.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Goals & Interests</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Code className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Full-Stack Development</h3>
                  <p className="text-gray-600 text-sm">
                    Building end-to-end web applications with modern technologies.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Cybersecurity Career</h3>
                  <p className="text-gray-600 text-sm">
                    Pursuing a career in cybersecurity to help protect organizations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Continuous Learning</h3>
                  <p className="text-gray-600 text-sm">
                    Always exploring new technologies and industry trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}