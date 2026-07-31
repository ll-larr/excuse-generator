import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExcuseForm } from "@/components/ExcuseForm";
import { MADNESS_DEFAULT, MADNESS_HINTS } from "@/lib/config";

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
  it("отправляет введённую ситуацию, уровень безумия и канал", async () => {
    render(<ExcuseForm />);
    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({
      situation: "проспал",
      madness: MADNESS_DEFAULT,
      channel: "sms",
    });
  });

  it("отправляет выбранный канал", async () => {
    render(<ExcuseForm />);
    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByLabelText(/вживую/i));
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(JSON.parse(String(init?.body)).channel).toBe("live");
  });

  it("помечает выбранный пресет для скринридера", async () => {
    render(<ExcuseForm />);
    const preset = screen.getByRole("button", { name: "опоздал на работу" });
    expect(preset).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(preset);
    expect(preset).toHaveAttribute("aria-pressed", "true");
  });

  it("объявляет появление отмазки", async () => {
    render(<ExcuseForm />);
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "aria-live",
      "polite",
    );

    await userEvent.type(screen.getByLabelText(/ситуация/i), "проспал");
    await userEvent.click(screen.getByRole("button", { name: /придумать/i }));

    expect(await screen.findByText(EXCUSE.excuse)).toBeInTheDocument();
  });

  it("показывает описание выбранного уровня", async () => {
    render(<ExcuseForm />);
    expect(screen.getByText(MADNESS_HINTS[MADNESS_DEFAULT])).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/уровень безумия/i), {
      target: { value: "5" },
    });

    expect(await screen.findByText(MADNESS_HINTS[5])).toBeInTheDocument();
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
