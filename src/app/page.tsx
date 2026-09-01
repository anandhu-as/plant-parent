import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HOUSEHOLDS_COOKIE } from "@/lib/token";
import { parseHouseholdList } from "@/lib/household-list";
import CreateHouseholdForm from "@/components/household/create-household-form";
import { APP_NAME, APP_DESC } from "@/constants";
import WelcomeToast from "@/components/ui/welcome-toast";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) => {
  const cookieStore = await cookies();
  const households = parseHouseholdList(cookieStore.get(HOUSEHOLDS_COOKIE)?.value);
  const { new: forceNew } = await searchParams;

  if (households.length > 0 && !forceNew) {
    redirect(`/h/${households[households.length - 1].token}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7fbf7,_#eef4ec_42%,_#e6ede3_100%)] text-stone-900">
      <WelcomeToast />
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur">
              <span className="text-base">🪴</span>
              Welcome to {APP_NAME}
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              {APP_NAME}
            </h1>
            <p className="mt-3 max-w-xl text-xl font-medium text-stone-700 sm:text-2xl">
              Keep every plant healthy without the chaos
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              {APP_DESC} Create one shared household, add your plants, and see exactly what needs attention today.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-600">
              <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm">No login required</div>
              <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm">Share by link</div>
              <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 shadow-sm">Simple watering reminders</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_70px_rgba(34,79,44,0.12)] backdrop-blur sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Get started
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-950">
                Create your first household
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Use a name everyone at home will recognize, like your apartment, room, or family nickname.
              </p>
            </div>
            <CreateHouseholdForm />
            <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
              <p className="font-medium">No account. No password.</p>
              <p className="mt-1 text-emerald-800/80">
                Just create a household and share the private link with the people who care for your plants.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;