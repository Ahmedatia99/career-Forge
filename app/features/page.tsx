import { DashboardHeader } from '../_components/dashboard-header';
import { AIFeedbackSection } from '../_components/feature/AI-FeedbackSection';
import CTASection from '@/app/_components/pricing-page/cta';
import { FeaturesGridSection } from '../_components/feature/FeaturesSection';
import { HeroSection } from '../_components/feature/HeroSection';
import { JobMatchingSection } from '../_components/feature/JobMatchingSection';
import { Footer } from '../_components/home-page/footer';

export default function page() {
	return (
		<>
			<DashboardHeader />
			<main className='mt-10 md:mt-5 lg:mt-8 min-h-screen bg-slate-50'>
				<HeroSection />
				<AIFeedbackSection />
				<JobMatchingSection />
				<FeaturesGridSection />
				<CTASection />
			</main>
			<Footer />
		</>
	);
}
