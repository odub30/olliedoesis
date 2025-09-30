// src/components/sections/AboutPreview.tsx
import Link from 'next/link';
import { ArrowRight, Download, MapPin } from 'lucide-react';

const skills = [
  { name: 'React/Next.js', level: 90, color: 'bg-blue-500' },
  { name: 'TypeScript', level: 85, color: 'bg-purple-500' },
  { name: 'Web Security', level: 75, color: 'bg-red-500' },
  { name: 'Node.js', level: 80, color: 'bg-green-500' },
  { name: 'UI/UX Design', level: 70, color: 'bg-pink-500' },
];

export function AboutPreview() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              About Me
            </h2>
            
            <div className="prose prose-lg text-gray-600 mb-8">
              <p>
                I&apos;m a passionate web developer with a strong focus on creating secure, 
                user-friendly applications. My journey started with curiosity about how 
                websites work, and has evolved into a deep appreciation for both the 
                creative and technical aspects of web development.
              </p>
              
              <p>
                Currently focusing on modern JavaScript frameworks, cybersecurity practices, 
                and building applications that make a difference in people&apos;s lives.
              </p>
            </div>

            <div className="flex items-center text-gray-600 mb-8">
              <MapPin className="w-5 h-5 mr-2" />
              <span>Based in Your City, State</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
              >
                Learn More About Me
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Resume
              </a>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Current Focus Areas
            </h3>
            
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm font-medium text-gray-900 mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Currently Learning</h4>
              <div className="flex flex-wrap gap-2">
                {['Advanced React Patterns', 'Cybersecurity', 'DevOps', 'System Design'].map((item) => (
                  <span 
                    key={item}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}