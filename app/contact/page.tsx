'use client';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '../_components/dashboard-header';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Clock } from '@deemlol/next-icons';
import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { useState } from 'react';
function page() {
	const [form, setForm] = useState({
		fullName: '',
		email: '',
		subject: '',
		message: '',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setForm({
			fullName: '',
			email: '',
			subject: '',
			message: '',
		});
	};
	return (
		<>
			<DashboardHeader />
			<div className=' bg-gray-100'>
				<div className='container grid grid-cols-1 lg:grid-cols-[2.7fr_1.6fr] mt-10 md:mt-5 lg:mt-6 gap-6 md:gap-8 mx-auto py-2 md:py-12 lg:py-10 px-4 md:px-8 lg:px-12 '>
					{/* Left Column - Image */}
					<div>
						<h1 className='text-3xl text-center lg:text-5xl lg:text-left font-extrabold mb-3 md:mb-5'>Get in Touch</h1>
						<p className='text-center lg:text-left text-sm md:text-base max-sm:hidden text-slate-500'>
							Have questions about our AI resume builder? Whether you need technical support, billing help, or just want
							to say hello, our team is ready to help you land your dream job.
						</p>
						<form className='mt-4 md:mt-5 rounded-xl bg-white p-4 md:p-6 shadow-lg' onSubmit={handleSubmit}>
							<div className='flex flex-col md:flex-row gap-4 md:gap-6'>
								{/* Full Name */}
								<div className='flex-1'>
									<label className='mb-2 mt-2 md:mt-4 block text-sm font-medium'>
										Full Name <span className='text-red-500'>*</span>
									</label>
									<Input
										name='fullName'
										className='w-full py-5 border-gray-200'
										placeholder='Enter your full name'
										required
										value={form.fullName} // Bind to state
										onChange={(e) => setForm({ ...form, fullName: e.target.value })}
									/>
								</div>

								{/* Email */}
								<div className='flex-1'>
									<label className='mb-2 mt-2 md:mt-4 block text-sm font-medium'>
										Work Email <span className='text-red-500'>*</span>
									</label>
									<Input
										name='email'
										type='email'
										className='w-full py-5 border-gray-200'
										placeholder='name@company.com'
										required
										value={form.email} // Bind to state
										onChange={(e) => setForm({ ...form, email: e.target.value })}
									/>
								</div>
							</div>

							{/* Subject */}
							<div className='w-full mt-5'>
								<label className='mb-2 mt-2 md:mt-4 block text-sm font-medium'>
									Subject <span className='text-red-500'>*</span>
								</label>
								<Select
									name='subject'
									required
									value={form.subject} // Bind to state
									onValueChange={(value) => setForm({ ...form, subject: value })}>
									<SelectTrigger className='w-full py-5 border-gray-200'>
										<SelectValue placeholder='Select a topic...' />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value='apple'>Apple</SelectItem>
											<SelectItem value='banana'>Banana</SelectItem>
											<SelectItem value='blueberry'>Blueberry</SelectItem>
											<SelectItem value='grapes'>Grapes</SelectItem>
											<SelectItem value='pineapple'>Pineapple</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							{/* Message */}
							<div className='w-full mt-5'>
								<label className='mb-2 mt-2 md:mt-4 block text-sm font-medium'>
									How can we help? <span className='text-red-500'>*</span>
								</label>
								<Textarea
									name='message'
									value={form.message} // Bind to state
									onChange={(e) => setForm({ ...form, message: e.target.value })}
									className='h-[120px] md:h-[150px]'
									placeholder='Please provide as much detail as possible so we can assist you better...'
								/>
							</div>

							{/* Submit Button */}
							<Button
								type='submit'
								className='mt-6 w-full md:w-1/2 lg:w-1/4 rounded-b-md py-5 bg-primary hover:bg-primary/90 text-white font-semibold'>
								Send message
							</Button>
						</form>
					</div>
					{/* Right Column - Contact Form */}
					<div className='flex flex-col mt-0 lg:mt-33'>
						<div className='rounded-xl bg-white p-6 md:p-8 lg:pr-18 shadow-lg'>
							<h2 className='mb-4 mt-3 text-xl md:text-2xl font-bold'>Contact Information</h2>
							<div className='flex flex-col space-y-4 text-slate-600 mb-7'>
								<div className='flex items-start gap-4 md:gap-6'>
									<div className='bg-blue-100/70 p-2 rounded-full shrink-0'>
										<Mail color='blue' />
									</div>
									<div>
										<h4 className='text-sm md:text-md font-bold'>Email Us</h4>
										<p className='text-slate-500 text-xs md:text-sm'>support@careerforge.com</p>
										<p className='text-slate-500 text-xs md:text-sm'>sales@careerforge.com</p>
									</div>
								</div>
								<div className='flex flex-col space-y-4 text-slate-600'>
									<div className='flex items-start gap-4 md:gap-6'>
										<div className='bg-blue-100/70 p-2 rounded-full shrink-0'>
											<Clock color='blue' />
										</div>
										<div>
											<h4 className='text-sm md:text-md font-bold'>Support Hours</h4>
											<p className='text-slate-500 text-xs md:text-sm'>Mon-Fri: 9am - 6pm EST</p>
											<p className='text-slate-500 text-xs md:text-sm'>Weekend: Closed</p>
										</div>
									</div>
								</div>
							</div>
							<div className='h-px bg-slate-300' />
							<div className='mt-6 text-left'>
								<h4 className='font-bold text-base md:text-lg'>Connect with us</h4>
								<div className='flex items-center gap-3 md:gap-4 mt-4'>
									<div className='bg-gray-100 rounded-full p-2'>
										<Link href='#'>
											<Image src='icons8-x.svg' alt='X' width={25} height={25} />
										</Link>
									</div>
									<div className='bg-gray-100 rounded-full p-2'>
										<Link href='#'>
											<Image src='icons8-linkedin.svg' alt='LinkedIn' width={25} height={25} />
										</Link>
									</div>
									<div className='bg-gray-100 rounded-full p-2'>
										<Link href='#'>
											<Image src='facebook-svgrepo-com.svg' alt='Facebook' width={25} height={25} />
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className='flex flex-col gap-3 mt-6 md:mt-8 rounded-xl bg-blue-50 p-6 md:p-8 shadow-lg'>
							<h4 className='text-base md:text-lg font-extrabold'>Quick Answers</h4>
							<p className='text-slate-500 text-xs md:text-sm'>
								Don't want to wait? Browse our Help Center for instant answers for common questions
							</p>
							<Link className='text-blue-500 font-bold text-sm md:text-base' href={'#'}>
								Visit Help Center
								<ArrowRight className='ml-1 inline' size={15} />
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Footer - responsive layout */}
			<div className='bg-white mt-5 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4'>
				<div className='flex items-center gap-2 justify-center rounded-lg'>
					<FileText className='h-4 md:h-5 w-4 md:w-5 text-black' />
					<p className='text-xs md:text-sm'>&copy; 2026 CareerForge. All rights reserved.</p>
				</div>
				<div className='flex items-center gap-3 md:gap-4 justify-center rounded-lg'>
					<p className='text-xs md:text-sm'>Privacy Policy</p>
					<p className='text-xs md:text-sm'>Terms of Service</p>
				</div>
			</div>
		</>
	);
}
export default page;
