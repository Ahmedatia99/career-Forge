import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Tabs } from './Tabs';
import type { LoginFormData, RegisterFormData } from '@/types/index';

export function MainForm({
	isLogin,
	setActiveTab,
	login,
	setLogin,
	register,
	setRegister,
	handleSubmit,
}: {
	login: LoginFormData;
	setLogin: React.Dispatch<React.SetStateAction<LoginFormData>>;
	register: RegisterFormData;
	setRegister: React.Dispatch<React.SetStateAction<RegisterFormData>>;
	handleSubmit: () => void;
	isLogin: boolean;
	setActiveTab: React.Dispatch<React.SetStateAction<'login' | 'register'>>;
}) {
	return (
		<Card className='relative w-full bg-white/95 backdrop-blur-xl shadow-2xl border border-blue-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8'>
			<div className='absolute inset-0 bg-linear-to-br from-blue-50/40 via-transparent to-transparent rounded-2xl sm:rounded-3xl pointer-events-none' />

			<div className='relative z-10'>
				<Tabs isLogin={isLogin} setActiveTab={setActiveTab} />
				<div className='space-y-4 sm:space-y-5'>
					{isLogin ? (
						<LoginForm login={login} setLogin={setLogin} />
					) : (
						<RegisterForm register={register} setRegister={setRegister} />
					)}

					<Button
						onClick={handleSubmit}
						className='w-full h-11 sm:h-12 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all'>
						{isLogin ? 'Login' : 'Register'}
						<ArrowRight className='w-4 sm:w-5 h-4 sm:h-5' />
					</Button>

					<div className='flex items-center gap-3 sm:gap-4 my-5 sm:my-6'>
						<div className='flex-1 h-px bg-slate-300' />
						<span className='text-slate-500 text-xs sm:text-sm font-medium whitespace-nowrap'>Or continue with</span>
						<div className='flex-1 h-px bg-slate-300' />
					</div>

					<Button
						variant='outline'
						className='w-full h-11 sm:h-12 border-2 border-slate-300 rounded-full font-semibold text-sm sm:text-base text-slate-900 hover:bg-slate-900 hover:border-slate-400 bg-white transition-all'>
						<svg className='w-4 sm:w-5 h-4 sm:h-5 mr-2' viewBox='0 0 24 24'>
							<image
								href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3Cpath fill='none' d='M1 1h22v22H1z'/%3E%3C/svg%3E"
								width='100%'
								height='100%'
							/>
						</svg>
						Continue with Google
					</Button>

					<p className='text-center text-slate-600 text-xs sm:text-sm mt-6 sm:mt-8'>
						{isLogin ? "Don't have an account? " : 'Already have an account? '}
						<button
							onClick={() => setActiveTab(isLogin ? 'register' : 'login')}
							className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'>
							{isLogin ? 'Register now' : 'Login now'}
						</button>
					</p>
				</div>
			</div>
		</Card>
	);
}
