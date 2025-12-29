import Image from 'next/image';
import { ListTodo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function JobMatchingSection() {
	return (
		<section className='py-15 lg:py-30 px-6 md:px-12 lg:px-24'>
			<div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
				<div className='space-y-6'>
					<div className='flex max-md:justify-center'>
						<div className='inline-flex items-center gap-2 px-3 py-1 rounded-full text-[#0066cc] text-xs font-bold uppercase tracking-wider'>
							<div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group hover:bg-blue-500'>
								<ListTodo className='w-6 h-6 text-[#0066cc] group-hover:text-white transition-colors' />
							</div>
							<p>Job Description Matching</p>
						</div>
					</div>
					<h2 className='text-2xl text-center md:text-4xl md:text-left font-bold text-slate-900 tracking-tight text-balance'>
						Tailor your resume to specific job postings instantly.
					</h2>
					<p className='text-center text-md lg:text-lg lg:text-left text-slate-600'>
						Paste the JD, and we'll tell you exactly what skills and keywords are missing. Increase your match score to
						ensure you're the candidate they're looking for.
					</p>
					<div className='pt-4 flex max-md:justify-center'>
						<Card className='max-w-md max-md:flex-1 lg:flex-1 border-slate-100 shadow-xl shadow-slate-200/50 bg-white'>
							<CardContent className='p-6 space-y-4'>
								<div className='flex justify-between items-center font-bold'>
									<span className='text-slate-900'>Match Score</span>
									<span className='text-[#0066cc]'>94%</span>
								</div>
								<div className='h-2.5 w-full bg-slate-100 rounded-full overflow-hidden'>
									<div className='h-full bg-[#0066cc] rounded-full w-[94%]' />
								</div>
								<p className='text-sm text-slate-500 font-semibold italic'>
									Excellent! Your profile matches key requirements.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
				<div className='relative aspect-3/2 rounded-2xl overflow-hidden shadow-2xl'>
					<Image src='/3.jpg' alt='Job Description Matching' width={700} height={100} className='object-contain' />
				</div>
			</div>
		</section>
	);
}
