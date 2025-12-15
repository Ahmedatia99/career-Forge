import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
	icon: LucideIcon;
	type: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}

export function FormInput({ icon: Icon, type, placeholder, value, onChange }: FormInputProps) {
	return (
		<div className='relative group'>
			<Icon className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 transition-colors group-focus-within:text-blue-500' />
			<Input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='pl-10 sm:pl-12 h-11 sm:h-12 border-2 border-slate-200 bg-linear-to-r from-blue-50/80 to-white/60 rounded-full focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-2 focus:ring-blue-200/50 placeholder:text-slate-400 transition-all font-medium text-sm sm:text-base text-slate-900'
			/>
		</div>
	);
}
