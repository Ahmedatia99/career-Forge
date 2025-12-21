'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User } from 'lucide-react';

import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { BrandingSection } from '../_components/Auth-page/BrandingSection';
import { FormInput } from '../_components/Auth-page/FormInput';
import { SubmitForm } from '../_components/Auth-page/SubmitForm';

export default function SignUpPage() {
	const router = useRouter();
	const { signup } = useAuth();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setError('');
		setIsLoading(true);

		try {
			await signup(firstName, lastName, email, password);
			router.push('/profile-setup');
		} catch {
			setError('Failed to create account. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden'>
			{/* Background effects */}
			<div className='absolute left-0 top-0 h-full w-40 bg-linear-to-r from-blue-200/40 to-transparent pointer-events-none' />
			<div className='absolute right-12 top-20 w-80 h-80 bg-linear-to-br from-blue-300/30 to-blue-200/20 rounded-full blur-3xl pointer-events-none' />

			<div className='w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10'>
				{/* Branding */}
				<BrandingSection />

				{/* Form */}
				<div className='w-full max-w-md mx-auto'>
					<div className='relative'>
						<div className='absolute inset-0 -z-10 bg-linear-to-r from-blue-400/40 to-blue-500/50 rotate-4 shadow-2xl rounded-2xl' />

						<Card className='relative bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-200/50 rounded-2xl p-8'>
							{/* Tabs */}
							<div className='flex gap-8 mb-8 border-b border-slate-200'>
								<Link href='/login' className='pb-3 text-lg font-semibold text-muted-foreground hover:text-primary'>
									Login
								</Link>
								<Link href='/register' className='pb-3 text-lg font-semibold border-b-2 border-blue-600'>
									Register
								</Link>
							</div>

							<div className='space-y-5'>
								<FormInput
									icon={User}
									type='text'
									placeholder='First name'
									value={firstName}
									onChange={setFirstName}
									disabled={isLoading}
								/>

								<FormInput
									icon={User}
									type='text'
									placeholder='Last name'
									value={lastName}
									onChange={setLastName}
									disabled={isLoading}
								/>

								<FormInput
									icon={Mail}
									type='email'
									placeholder='Email address'
									value={email}
									onChange={setEmail}
									disabled={isLoading}
								/>

								<FormInput
									icon={Lock}
									type='password'
									placeholder='Password'
									value={password}
									onChange={setPassword}
									disabled={isLoading}
								/>

								<FormInput
									icon={Lock}
									type='password'
									placeholder='Confirm password'
									value={confirmPassword}
									onChange={setConfirmPassword}
									disabled={isLoading}
								/>

								{error && <p className='text-sm text-destructive'>{error}</p>}

								<SubmitForm handleSubmit={handleSubmit} isLogin={false} loading={isLoading} />
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
