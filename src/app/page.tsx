import Profile from "@/app/Profile";

export default async function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="border-2 border-white p-5 font-mono font-semibold">
        Homepage
      </div>
      <Profile />
    </main>
  );
}
