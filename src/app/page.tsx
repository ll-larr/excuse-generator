import { ExcuseForm } from "@/components/ExcuseForm";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Генератор отмазок</h1>
      <p className="mt-2 opacity-70">
        Опиши, за что нужно оправдаться. Остальное придумаем сами.
      </p>
      <div className="mt-8">
        <ExcuseForm />
      </div>
    </main>
  );
}
