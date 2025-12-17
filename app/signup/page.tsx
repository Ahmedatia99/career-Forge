'use client';

import { useState } from 'react';
import { BrandingSection } from '../_components/Auth-page/BrandingSection';
import { Card } from '@/components/ui/card';
import type { RegisterFormData } from '@/types/index';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { FormInput } from '../_components/Auth-page/FormInput';
import { SubmitForm } from '../_components/Auth-page/SubmitForm';

export default function SignUpPage() {
	const [register, setRegister] = useState<RegisterFormData>({
		email: '',
		password: '',
		confirmedPassword: '',
	});

	const handleSubmit = () => {
		console.log('Register data:', register);
		setRegister({ email: '', password: '', confirmedPassword: '' });
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-4 relative overflow-hidden'>
			<div className='absolute left-0 top-0 h-full w-40 sm:w-60 lg:w-80 bg-linear-to-r from-blue-200/40 via-blue-100/10 to-transparent pointer-events-none' />
			<div className='absolute right-12 sm:right-24 top-10 sm:top-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-linear-to-br from-blue-300/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none' />

			<div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center relative z-10'>
				<BrandingSection />

				<div className='w-full px-4 sm:px-0'>
					<div className='relative w-full max-w-md mx-auto'>
						<div className='absolute inset-0 -z-10 bg-linear-to-r from-blue-400/40 to-blue-500/50 rotate-4 shadow-2xl rounded-2xl' />
						<Card className='relative w-full bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8'>
							<div className='absolute inset-0 bg-linear-to-br from-blue-50/40 via-transparent to-transparent rounded-2xl sm:rounded-3xl pointer-events-none' />

							<div className='relative z-10'>
								<div className='flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-slate-200'>
									<Link
										href='/login'
										className={'pb-2 sm:pb-3 text-base sm:text-lg font-semibold transition-all duration-200 '}>
										{'Login'}
									</Link>
									<Link
										href='/register'
										className={
											'pb-2 sm:pb-3 text-base sm:text-lg font-semibold transition-all duration-200 text-slate-900 border-b-2 border-blue-600'
										}>
										{'Register'}
									</Link>
								</div>
								<div className='space-y-4 sm:space-y-5'>
									<FormInput
										icon={Mail}
										type='email'
										placeholder='Email address'
										value={register.email}
										onChange={(value) => setRegister((prev) => ({ ...prev, email: value }))}
									/>

									<FormInput
										icon={Lock}
										type='password'
										placeholder='Password'
										value={register.password}
										onChange={(value) => setRegister((prev) => ({ ...prev, password: value }))}
									/>

									<FormInput
										icon={Lock}
										type='password'
										placeholder='Confirm password'
										value={register.confirmedPassword}
										onChange={(value) => setRegister((prev) => ({ ...prev, confirmedPassword: value }))}
									/>
									<SubmitForm handleSubmit={handleSubmit} isLogin={false} />
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
