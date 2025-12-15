'use client';

import { useState } from 'react';
import { BrandingSection } from '@/app/pages/BrandingSection';
import { MainForm } from '../MainForm';
import type { LoginFormData, RegisterFormData } from '@/types/index';

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

	const [login, setLogin] = useState<LoginFormData>({
		email: '',
		password: '',
	});

	const [register, setRegister] = useState<RegisterFormData>({
		email: '',
		password: '',
		confirmedPassword: '',
	});

	const handleSubmit = () => {
		if (activeTab === 'login') {
			console.log('Login data:', login);
			setLogin({ email: '', password: '' });
		} else {
			console.log('Register data:', register);
			setRegister({ email: '', password: '', confirmedPassword: '' });
		}
	};
	const isLogin = activeTab === 'login';

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-4 relative overflow-hidden'>
			<div className='absolute left-0 top-0 h-full w-40 sm:w-60 lg:w-80 bg-linear-to-r from-blue-200/40 via-blue-100/10 to-transparent pointer-events-none' />
			<div className='absolute right-12 sm:right-24 top-10 sm:top-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-linear-to-br from-blue-300/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none' />

			<div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center relative z-10'>
				<BrandingSection isMobile />

				<BrandingSection />

				<div className='w-full px-4 sm:px-0'>
					<div className='relative w-full max-w-md mx-auto'>
						<div className='absolute inset-0 -z-10 bg-linear-to-r from-blue-400/40 to-blue-500/50 rotate-4 shadow-2xl rounded-2xl' />

						<MainForm
							isLogin={isLogin}
							login={login}
							register={register}
							setLogin={setLogin}
							setRegister={setRegister}
							setActiveTab={setActiveTab}
							handleSubmit={handleSubmit}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
