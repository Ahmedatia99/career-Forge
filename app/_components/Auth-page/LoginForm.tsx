import { Mail, Lock } from 'lucide-react';
import { FormInput } from './FormInput';
import type { LoginFormData } from '@/types/index';
export function LoginForm({
	login,
	setLogin,
}: {
	login: LoginFormData;
	setLogin: React.Dispatch<React.SetStateAction<LoginFormData>>;
}) {
	return (
		<>
			<FormInput
				icon={Mail}
				type='email'
				placeholder='Email address'
				value={login.email}
				onChange={(value) => setLogin((prev) => ({ ...prev, email: value }))}
			/>

			<FormInput
				icon={Lock}
				type='password'
				placeholder='Password'
				value={login.password}
				onChange={(value) => setLogin((prev) => ({ ...prev, password: value }))}
			/>

			<div className='text-right pt-1'>
				<a href='#' className='text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors'>
					Forgot password?
				</a>
			</div>
		</>
	);
}
