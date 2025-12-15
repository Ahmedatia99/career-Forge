export function Tabs({
	isLogin,
	setActiveTab,
}: {
	isLogin: boolean;
	setActiveTab: (tab: 'login' | 'register') => void;
}) {
	return (
		<div className='flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-slate-200'>
			<button
				onClick={() => setActiveTab('login')}
				className={`pb-2 sm:pb-3 text-base sm:text-lg font-semibold transition-all duration-200 ${
					isLogin ? 'text-slate-900 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
				}`}>
				Login
			</button>
			<button
				onClick={() => setActiveTab('register')}
				className={`pb-2 sm:pb-3 text-base sm:text-lg font-semibold transition-all duration-200 ${
					!isLogin ? 'text-slate-900 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'
				}`}>
				Register
			</button>
		</div>
	);
}
