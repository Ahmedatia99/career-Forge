import Image from 'next/image';

export function BrandingSection() {
	return (
		<div className='lg:block sm:text-center px-4 sm:mb-8 relative'>
			<div className='sm:hidden lg:block absolute -top-7 -left-5 w-100 h-95 border-t-2 rounded-tr-none rounded-bl-none border-t-gray-500/5 border-l-2 border-l-gray-500/5 rounded-4xl' />

			<div className='flex sm:justify-center max-md:justify-center lg:justify-start  items-center gap-2'>
				<Image
					className='mb-6 mr-2 sm:mb-8 inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-linear-to-br from-blue-200 to-blue-100 shadow-lg'
					src='../brain.svg'
					width={100}
					height={100}
					alt='AI CV Builder Icon'
				/>
				<h2 className='text-xl sm:text-4xl lg:text-3xl max-sm:text-center font-semibold text-slate-900 mb-2 sm:mb-4 leading-tight'>
					AI CV Builder
				</h2>
			</div>

			<p className='text-base lg:text-left sm:text-lg lg:text-4xl max-sm:text-center text-slate-900 lg:mb-3 sm:mb-3 font-semibold'>
				Your career launchpad, powered by intelligence.
			</p>
			<p className='text-slate-800 text-sm lg:text-left lg:block md:text-center max-md:mx-auto  sm:hidden max-sm:hidden leading-relaxed max-w-sm'>
				Build professional resumes in minutes with our advanced AI technology designed for students and fresh graduates.
			</p>
		</div>
	);
}
