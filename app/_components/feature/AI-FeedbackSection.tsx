import Image from 'next/image';
import { WandSparkles, Check } from 'lucide-react';

export function AIFeedbackSection() {
  const features = [
    'Instant grammar and spell check',
    'Action verb suggestions',
    'Readability scoring'
  ];

  return (
    <section className='py-15 lg:py-30 px-6 md:px-12 lg:px-24 bg-slate-100 border-y border-slate-100'>
      <div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center md:order-1'>
        <div className='aspect-auto rounded-2xl overflow-hidden shadow-2xl md:order-1 order-2'>
          <Image src='/2.jpg' alt='AI Resume Optimization' width={700} height={50} />
        </div>
        <div className='space-y-6 md:order-2'>
          <div className='flex max-md:justify-center'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#0066cc] text-xs font-bold uppercase tracking-wider'>
              <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group hover:bg-blue-500'>
                <WandSparkles className='w-6 h-6 text-[#0066cc] group-hover:text-white transition-colors' />
              </div>
              <p>AI-Powered Enhancement</p>
            </div>
          </div>
          <h2 className='text-2xl text-center md:text-4xl md:text-left font-bold text-slate-900 tracking-tight text-balance'>
            Real-time feedback on formatting, keywords, and tone.
          </h2>
          <p className='text-center text-md lg:text-lg lg:text-left text-slate-600'>
            Our AI analyzes your resume against millions of successful profiles to suggest high-impact improvements.
            Get actionable insights to improve your readability score and pass initial screenings.
          </p>
          <ul className='space-y-3 pt-2'>
            {features.map((item) => (
              <li key={item} className='flex items-center max-sm:pl-5 gap-3 text-slate-700 font-bold'>
                <div className='shrink-0 lg:w-5 lg:h-5 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center'>
                  <Check className='lg:w-3.5 lg:h-3.5 w-6 h-6 text-white stroke-3' />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}