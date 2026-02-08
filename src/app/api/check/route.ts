import { riddles } from "@/app/data/riddles";
import { NextResponse } from "next/server";

const DISCORD_WEBHOOK_URL = "TU_WLEJ_SWOJ_WEBHOOK_URL"; // Stwórz na Discordzie

export async function POST(req: Request) {
  const { day, guess } = await req.json();
  const riddle = riddles.find((r) => r.day === day);

  if (riddle && guess.toLowerCase().trim() === riddle.answer.toLowerCase()) {
    // Powiadomienie dla Ciebie na Discord
    if (DISCORD_WEBHOOK_URL !== "TU_WLEJ_SWOJ_WEBHOOK_URL") {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `❤️ **Sukces!** Odgadła hasło na dzień ${day}. Odpowiedź: "${guess}"`,
        }),
      });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
