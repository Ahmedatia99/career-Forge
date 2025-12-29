import { ScanText, FileText, History, TextSearch, FilePenLine, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
	{
		title: 'ATS Compatibility Analysis',
		description: 'Scan your resume against standard ATS algorithms to ensure it parses correctly and stays readable.',
		icon: ScanText,
	},
	{
		title: 'Professional PDF Generation',
		description: 'Download perfectly formatted PDFs that keep your layout intact every time, on every device.',
		icon: FileText,
	},
	{
		title: 'Version Control',
		description: 'Never lose a draft. Save unlimited versions for different industries and revert changes easily.',
		icon: History,
	},
	{
		title: 'Keyword Optimization',
		description: 'Identify missing industry terms, hard skills, and soft skills to boost your search ranking.',
		icon: TextSearch,
	},
	{
		title: 'Cover Letter Assistant',
		description: "Generate tailored cover letters that match your resume's style and tone in seconds.",
		icon: FilePenLine,
	},
	{
		title: 'Application Tracking',
		description: 'Keep track of every application status, interview date, and follow-up in one organized dashboard.',
		icon: LayoutDashboard,
	},
];

export function FeaturesGridSection() {
	return (
		<section className='py-15 lg:py-30 px-6 md:px-12 lg:px-24 bg-slate-100 border-t border-slate-100'>
			<div className='max-w-7xl mx-auto space-y-16'>
				<div className='text-center space-y-4 max-w-3xl mx-auto'>
					<h2 className='text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight text-balance'>
						Everything you need to land your next role
					</h2>
					<p className='text-lg text-slate-500 leading-relaxed'>
						From drafting to applying, CareerForge equips you with professional tools to manage your entire job search
						process.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{features.map((feature, idx) => (
						<Card key={idx} className='border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white group'>
							<CardContent className='p-4 lg:p-8 space-y-4 flex flex-col lg:items-start items:center text-center lg:text-left'>
								<div className='flex max-md:justify-center'>
									<div className='w-18 h-18 lg:w-12 lg:h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-[#0066cc] transition-colors duration-300'>
										<feature.icon className='w-9 h-9 lg:w-6 lg:h-6 text-[#0066cc] group-hover:text-white transition-colors duration-300' />
									</div>
								</div>
								<h3 className='text-xl font-bold text-slate-900'>{feature.title}</h3>
								<p className='text-slate-500 leading-relaxed'>{feature.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
