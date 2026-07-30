import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExcuseForm } from "@/components/ExcuseForm";
import { MADNESS_DEFAULT } from "@/lib/config";

const EXCUSE = {
  excuse: "Лифт застрял",
  plausibility: 70,
  risk_note: "Соседи не подтвердят",
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => EXCUSE,
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ExcuseForm", () => {
  it("отправляет введённую ситуацию и уровень безумия", async () => {
    render(<ExcuseForm />);
    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({
      situation: "проспал",
      madness: MADNESS_DEFAULT,
    });
  });

  it("показывает отмазку после успешного ответа", async () => {
    render(<ExcuseForm />);
    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    expect(await screen.findByText(EXCUSE.excuse)).toBeInTheDocument();
  });

  it("подставляет пресет в поле ввода", async () => {
    render(<ExcuseForm />);
    await userEvent.click(
      screen.getByRole("button", { name: "опоздал на работу" }),
    );
    expect(screen.getByLabelText(/ситуация/i)).toHaveValue("опоздал на работу");
  });

  it("не отправляет запрос при пустом поле", async () => {
    render(<ExcuseForm />);
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("показывает ошибку сервера и оставляет кнопку активной", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Слишком много отмазок. Отдышись." }),
    } as Response);

    render(<ExcuseForm />);
    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    expect(await screen.findByText(/слишком много отмазок/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /придумать/i })).toBeEnabled();
  });
});
