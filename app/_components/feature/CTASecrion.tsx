import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className='py-12 md:py-16 lg:py-20 px-6 md:px-12 lg:px-24'>
      <div className='bg-linear-to-br from-blue-600 to-blue-800 max-w-7xl py-12 md:py-16 lg:py-20 px-6 md:px-8 space-y-4 md:space-y-6 rounded-xl mx-auto flex flex-col justify-center items-center'>
        <h1 className='text-2xl md:text-4xl lg:text-5xl font-extrabold text-white text-center px-4'>
          Ready to transform your job search?
        </h1>
        <p className='text-center font-medium text-white text-base md:text-lg max-w-md leading-relaxed px-4'>
          Join thousands of professionals who have landed their dream jobs using CareerForge
        </p>
        <Button
          asChild
          size='lg'
          className='bg-white text-blue-900 hover:bg-blue-950 hover:text-white transition-colors duration-300 font-semibold shadow-lg hover:shadow-xl'>
          <Link href='/signup'>Create Free Resume</Link>
        </Button>
      </div>
    </section>
  );
}