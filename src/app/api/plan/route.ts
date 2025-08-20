import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/app/data/destinations";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const { searchParams } = new URL(req.url);
    const useAi = searchParams.get("useAi") === "true";

    const match = DESTINATIONS.find(
      (d) => d.place.toLowerCase() === query.toLowerCase()
    );

    if (!match) {
      return NextResponse.json(
        { ok: false, error: "Destination not found" },
        { status: 404 }
      );
    }

    const itinerary = useAi
      ? `✨ AI suggests a personalized trip to ${match.place}. Enjoy ${match.highlight} in a unique way!`
      : `Explore ${match.place}, known for ${match.highlight}. Suggested 2-day trip: Day 1 explore main attractions, Day 2 relax and enjoy local culture.`;

    return NextResponse.json({
      ok: true,
      results: [
        {
          ...match,
          itinerary,
        },
      ],
    });
  } catch (err: unknown) {
    let errorMessage = "Something went wrong";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
