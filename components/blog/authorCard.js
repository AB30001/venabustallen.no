import Image from "next/image";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { getAuthorImage } from "@/lib/local-images";
import Link from "next/link";

export default function AuthorCard({ author }) {
  const imageProps = getAuthorImage(author);
  return (
    <div className="mt-6 border border-line bg-mist/30 px-6 py-8 text-ink md:px-8">
      <div className="flex flex-wrap items-start sm:flex-nowrap sm:gap-6">
        <div className="relative mt-1 h-20 w-20 flex-shrink-0 overflow-hidden">
          {imageProps && (
            <Link href={`/author/${author.slug.current}`}>
              <Image
                src={imageProps.src}
                alt={author.name}
                className="object-cover"
                fill
                sizes="80px"
              />
            </Link>
          )}
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-brand text-accent">
            Om {author.name}
          </h3>
          <div className="mt-3 prose-venabu text-sm">
            {author.bio && <PortableText value={author.bio} />}
          </div>
          <div className="mt-4">
            <Link href={`/author/${author.slug.current}`} className="btn-pill !px-5 !py-2">
              Se profil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
