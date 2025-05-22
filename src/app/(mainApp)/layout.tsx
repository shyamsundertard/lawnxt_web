import BottomNavbar from "../ui/components/BottomNavBar";
import Sidebar from "../ui/SideBar";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const userId = cookieStore.get('current_session')?.value;

  if (!userId) {
    redirect('/login');
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getUserAndFirm?userId=${userId}`, {
    cache: 'no-store', // optional: to avoid stale data
  });

  const { firm, member } = await response.json();

  if (!firm) {
    redirect('/onboarding/firm-selection');
  }

  if (member?.status === 'Pending') {
    redirect('/onboarding/pending-approval');
  }

  return (
    <div className="md:ml-[250px] mb-[90px] md:mb-6">
      <Sidebar />
      <BottomNavbar />
      {children}
    </div>
  );
}
