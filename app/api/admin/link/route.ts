
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Link from "@/models/Link";

export async function GET() {
    try {
        await connectDB();

        const links = await Link.find({}).sort({ _id: -1 });

        return NextResponse.json({ links }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch links" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const data = await request.json();
        const name = typeof data.name === "string" ? data.name.trim() : "";

        if (!name) {
            return NextResponse.json(
                { error: "Link name is required" },
                { status: 400 }
            );
        }

        const newLink = await Link.create({ name });

        return NextResponse.json(
            { link: newLink },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to create link" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        await connectDB();

        const result = await Link.deleteMany({});

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount,
        });
    } catch {
        return NextResponse.json(
            { error: "Failed to delete links" },
            { status: 500 }
        );
    }
}
