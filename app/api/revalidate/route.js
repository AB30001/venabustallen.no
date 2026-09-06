import { revalidatePath } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature", revalidated: false },
        { status: 401 }
      );
    }

    if (!body?._id) {
      return NextResponse.json(
        { message: "Bad Request", revalidated: false },
        { status: 400 }
      );
    }

    const paths = ["/", "/archive", "/sitemap.xml"];

    if (body._type === "post" && body.slug?.current) {
      paths.push(`/post/${body.slug.current}`);
    }

    if (body._type === "category" && body.slug?.current) {
      paths.push(`/category/${body.slug.current}`);
    }

    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      paths,
      type: body._type,
      id: body._id
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.message, revalidated: false },
      { status: 500 }
    );
  }
}
