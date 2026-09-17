import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import { notFound } from "next/navigation";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import { getPostImage, getAuthorImage } from "@/lib/local-images";
import { parseISO, format } from "date-fns";

import CategoryLabel from "@/components/blog/category";
import AuthorCard from "@/components/blog/authorCard";

export default function Post(props) {
  const { loading, post } = props;
  const slug = post?.slug;

  if (!loading && !slug) {
    notFound();
  }

  const imageProps = getPostImage(post);
  const AuthorimageProps = getAuthorImage(post?.author);
  const related = (post?.related || []).filter(
    item => item?.slug?.current && item.slug.current !== slug?.current
  );

  return (
    <>
      <Container className="!pt-2">
        <div className="mx-auto max-w-screen-md text-center">
          <div className="flex justify-center">
            <CategoryLabel categories={post.categories} />
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-wide text-charcoal md:text-4xl lg:text-5xl lg:leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex justify-center text-muted">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden">
                {AuthorimageProps && (
                  <Link href={`/author/${post.author.slug.current}`}>
                    <Image
                      src={AuthorimageProps.src}
                      alt={post?.author?.name}
                      className="object-cover"
                      fill
                      sizes="40px"
                    />
                  </Link>
                )}
              </div>
              <div className="text-left">
                <p className="font-display text-[11px] font-semibold uppercase tracking-brand text-accent">
                  <Link href={`/author/${post.author.slug.current}`}>
                    {post.author.name}
                  </Link>
                </p>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <time dateTime={post?.publishedAt || post._createdAt}>
                    {format(
                      parseISO(post?.publishedAt || post._createdAt),
                      "dd.MM.yyyy"
                    )}
                  </time>
                  <span>· {post.estReadingTime || "5"} min lesing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="relative z-0 mx-auto mt-8 aspect-[16/9] max-w-screen-lg overflow-hidden">
        {imageProps && (
          <Image
            src={imageProps.src}
            alt={post.mainImage?.alt || post.title || "Thumbnail"}
            priority
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        )}
      </div>

      <Container>
        <article className="mx-auto max-w-screen-md">
          <div className="prose-venabu my-10">
            {post.body && <PortableText value={post.body} />}
          </div>
          <div className="mb-10 mt-10 flex justify-center">
            <Link href="/archive" className="btn-pill">
              ← Se alle innlegg
            </Link>
          </div>
          {post.author && <AuthorCard author={post.author} />}
        </article>

        {related.length > 0 && (
          <aside className="mx-auto mt-16 max-w-screen-md border-t border-line pt-12">
            <h2 className="font-display text-sm font-semibold uppercase tracking-brand text-charcoal">
              Relaterte artikler
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.slice(0, 3).map(item => {
                const thumb = getPostImage(item);
                return (
                  <li key={item._id || item.slug.current}>
                    <Link
                      href={`/post/${item.slug.current}`}
                      className="group block">
                      {thumb && (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={thumb.src}
                            alt={item.title || ""}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      )}
                      <p className="mt-3 font-display text-sm font-semibold uppercase tracking-wide text-charcoal group-hover:text-accent">
                        {item.title}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </Container>
    </>
  );
}
