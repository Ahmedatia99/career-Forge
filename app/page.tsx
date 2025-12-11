'use client';
import { Button } from '@/components/ui/button';
// import { signIn } from "next-auth/react"
export default function Home() {
	return (
		<div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
			<Button onClick={() => signIn('github')}>Sign In</Button>
		</div>
	);
}
