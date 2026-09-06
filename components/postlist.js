import Image from "next/image";
import Link from "next/link";
import { cx } from "@/utils/all";
import { getPostImage, getAuthorImage } from "@/lib/local-images";
import { parseISO, format } from "date-fns";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CategoryLabel from "@/components/blog/category";

export default function PostList({
  post,
  aspect,
  minimal,
  pathPrefix,
  preloadImage,
  fontSize,
  fontWeight
}) {
  const imageProps = getPostImage(post);
  const AuthorimageProps = getAuthorImage(post?.author);

  return (
    <article
      className={cx(
        "group",
        minimal && "grid items-center gap-8 md:grid-cols-2"
      )}>
      <div className="overflow-hidden bg-mist/40">
        <Link
          className={cx(
            "relative block",
            aspect === "landscape"
              ? "aspect-[16/10]"
              : aspect === "custom"
              ? "aspect-[5/4]"
              : "aspect-square"
          )}
          href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post.slug.current}`}>
          {imageProps ? (
            <Image
              src={imageProps.src}
              {...(post.mainImage.blurDataURL && {
                placeholder: "blur",
                blurDataURL: post.mainImage.blurDataURL
              })}
              alt={post.mainImage.alt || post.title || "Thumbnail"}
              priority={!!preloadImage}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-line">
              <PhotoIcon />
            </span>
          )}
        </Link>
      </div>

      <div>
        <CategoryLabel categories={post.categories} nomargin={minimal} />
        <h2
          className={cx(
            "mt-3 font-display leading-snug text-charcoal",
            fontSize === "large" || minimal
              ? "text-2xl md:text-3xl"
              : "text-lg md:text-xl",
            fontWeight === "normal" ? "font-medium" : "font-bold"
          )}>
          <Link
            href={`/post/${pathPrefix ? `${pathPrefix}/` : ""}${post.slug.current}`}
            className="bg-gradient-to-r from-accent to-accent bg-[length:0_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 hover:bg-[length:100%_1px]">
            {post.title}
          </Link>
        </h2>

        <div className="mt-3 flex items-center gap-3 text-sm text-muted">
          {post?.author?.slug?.current && (
            <Link
              href={`/author/${post.author.slug.current}`}
              className="flex items-center gap-2 hover:text-accent">
              {AuthorimageProps && (
                <span className="relative h-6 w-6 flex-shrink-0 overflow-hidden">
                  <Image
                    src={AuthorimageProps.src}
                    alt={post?.author?.name || ""}
                    className="object-cover"
                    fill
                    sizes="24px"
                  />
                </span>
              )}
              <span className="font-display text-[11px] font-semibold uppercase tracking-brand">
                {post?.author?.name}
              </span>
            </Link>
          )}
          <span className="text-line">·</span>
          <time dateTime={post?.publishedAt || post._createdAt}>
            {format(
              parseISO(post?.publishedAt || post._createdAt),
              "dd.MM.yyyy"
            )}
          </time>
        </div>
      </div>
    </article>
  );
}
