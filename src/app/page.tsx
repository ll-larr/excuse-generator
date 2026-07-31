import { ExcuseForm } from "@/components/ExcuseForm";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[46px]">
        Генератор отмазок
      </h1>
      <p className="mt-3 max-w-xl text-base/relaxed opacity-65 sm:text-lg/relaxed">
        Опиши, за что нужно оправдаться. Остальное придумаем сами.
      </p>
      <div className="mt-8 sm:mt-10">
        <ExcuseForm />
      </div>
    </main>
  );
}
