import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
	return (
		<section className='py-15 lg:py-30 px-6 md:px-12 lg:px-24'>
			<div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
				<div className='space-y-6'>
					<h1 className='text-3xl text-center md:text-4xl lg:text-6xl lg:text-left font-extrabold tracking-tight text-slate-900 text-balance'>
						Powerful Features for Serious Job Seekers
					</h1>
					<p className='text-center text-md lg:text-lg lg:text-left text-slate-600 leading-relaxed max-w-xl'>
						Our comprehensive suite of tools helps you beat the bots and impress recruiters. CareerForge uses advanced
						AI to tailor, optimize, and format your resume perfectly.
					</p>
					<div className='flex flex-wrap gap-4 pt-4'>
						<Button
							size='lg'
							className='bg-[#0066cc] hover:bg-[#0052a3] text-white px-8 font-semibold rounded-md w-full lg:w-auto'>
							Start Free Optimization
						</Button>
						<Button
							size='lg'
							variant='outline'
							className='border-slate-200 text-slate-900 px-8 font-semibold rounded-md bg-transparent w-full lg:w-auto'>
							View Pricing
						</Button>
					</div>
				</div>
				<div className='aspect-auto rounded-2xl overflow-hidden shadow-2xl'>
					<Image src='/1.jpg' alt='AI Resume Optimization' width={700} height={150} />
				</div>
			</div>
		</section>
	);
}
