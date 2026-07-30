import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ExcuseCard } from "@/components/ExcuseCard";

const EXCUSE = {
  excuse: "Лифт застрял между этажами",
  plausibility: 70,
  risk_note: "Соседи могут не подтвердить",
};

describe("ExcuseCard", () => {
  it("показывает текст отмазки, рейтинг и заметку о рисках", () => {
    render(<ExcuseCard excuse={EXCUSE} />);
    expect(screen.getByText(EXCUSE.excuse)).toBeInTheDocument();
    expect(screen.getByText(/70/)).toBeInTheDocument();
    expect(screen.getByText(EXCUSE.risk_note)).toBeInTheDocument();
  });

  it("копирует в буфер только текст отмазки", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ExcuseCard excuse={EXCUSE} />);
    await userEvent.click(screen.getByRole("button", { name: /скопировать/i }));

    expect(writeText).toHaveBeenCalledWith(EXCUSE.excuse);
  });

  it("подтверждает копирование", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    render(<ExcuseCard excuse={EXCUSE} />);
    await userEvent.click(screen.getByRole("button", { name: /скопировать/i }));

    expect(await screen.findByText(/скопировано/i)).toBeInTheDocument();
  });

  it("сообщает, когда скопировать не удалось", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });

    render(<ExcuseCard excuse={EXCUSE} />);
    await userEvent.click(screen.getByRole("button", { name: /скопировать/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
