interface BrandingSectionProps {
	isMobile?: boolean;
}

export function BrandingSection({ isMobile = false }: BrandingSectionProps) {
	if (isMobile) {
		return (
			<div className='lg:hidden text-center px-4 mb-6 sm:mb-8'>
				<img
					className='mb-6 mr-2 sm:mb-8 inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-linear-to-br from-blue-200 to-blue-100 shadow-lg'
					src='brain.svg'
					alt='AI CV Builder Icon'
				/>
				<h1 className='text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight'>AI CV Builder</h1>
				<p className='text-base sm:text-lg text-slate-900 mb-2 sm:mb-3 font-semibold'>
					Your career launchpad, powered by intelligence.
				</p>
				<p className='text-slate-600 text-sm sm:text-base leading-relaxed max-w-sm mx-auto'>
					Build professional resumes in minutes with our advanced AI technology designed for students and fresh
					graduates.
				</p>
			</div>
		);
	}

	return (
		<div className='hidden lg:block text-left px-4 relative'>
			<div className='absolute -top-7 -left-5 w-60 h-100 border-t-2 border-t-gray-500/5 border-l-2 border-l-gray-500/5 rounded-4xl' />

			<div className='flex items-center gap-2'>
				<img
					className='mb-6 mr-2 sm:mb-8 inline-flex items-center justify-center w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-linear-to-br from-blue-200 to-blue-100 shadow-lg'
					src='brain.svg'
					alt='AI CV Builder Icon'
				/>
				<h2 className='text-xl sm:text-4xl lg:text-3xl font-semibold text-slate-900 mb-2 sm:mb-4 leading-tight'>
					AI CV Builder
				</h2>
			</div>

			<p className='text-base sm:text-lg lg:text-4xl text-slate-900 mb-2 sm:mb-3 font-semibold'>
				Your career launchpad, powered by intelligence.
			</p>
			<p className='text-slate-800 text-sm sm:text-base leading-relaxed max-w-sm'>
				Build professional resumes in minutes with our advanced AI technology designed for students and fresh graduates.
			</p>
		</div>
	);
}
