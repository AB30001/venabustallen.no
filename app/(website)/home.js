import Link from "next/link";
import Image from "next/image";
import Container from "@/components/container";
import PostList from "@/components/postlist";
import Button from "@/components/ui/button";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";
import { DESIGN_PHOTOS } from "@/lib/design-photos";

export default function Post({ posts }) {
  const hasPosts = posts && posts.length > 0;

  return (
    <>
      {/* Full-bleed hero — brand strings only (no new marketing copy) */}
      <section className="relative isolate min-h-[58vh] w-full overflow-hidden md:min-h-[68vh]">
        <Image
          src={DESIGN_PHOTOS.heroRide.src}
          alt={DESIGN_PHOTOS.heroRide.alt}
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/55 via-charcoal/30 to-transparent" />
        <div className="relative z-10 flex min-h-[58vh] items-center md:min-h-[68vh]">
          <Container className="!py-16" large>
            <h1 className="mt-0 max-w-xl font-display text-4xl font-bold uppercase tracking-wide text-white md:text-5xl lg:text-6xl">
              {SITE_NAME}
            </h1>
            <p className="mt-5 max-w-lg font-serif text-lg italic leading-relaxed text-white/90 md:text-xl">
              {SITE_TAGLINE}
            </p>
          </Container>
        </div>
      </section>

      {/* Intro strip */}
      <section className="section-y bg-paper">
        <Container className="!py-0">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rule mb-8" />
            <p className="font-sans text-base leading-relaxed text-ink md:text-lg">
              {SITE_TAGLINE}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="rule" />
              <Button href="/archive">View all Posts</Button>
              <div className="rule" />
            </div>
          </div>
        </Container>
      </section>

      {/* Photo band */}
      <section className="relative isolate min-h-[42vh] w-full overflow-hidden md:min-h-[48vh]">
        <Image
          src={DESIGN_PHOTOS.bandTrail.src}
          alt={DESIGN_PHOTOS.bandTrail.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/35" />
        <div className="relative z-10 flex min-h-[42vh] items-center md:min-h-[48vh]">
          <Container className="!py-16">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
                {SITE_NAME}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/90">
                {SITE_TAGLINE}
              </p>
              <div className="mt-8">
                <Button href="/about" variant="light">
                  Om oss
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Editorial + posts */}
      <section className="section-y bg-paper">
        <Container className="!py-0" large>
          <div className="grid items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-serif text-2xl italic leading-snug text-charcoal md:text-3xl">
                «{SITE_TAGLINE}»
              </p>
              <div className="mt-8">
                <Image
                  src={DESIGN_PHOTOS.fjordHorseSnow.src}
                  alt={DESIGN_PHOTOS.fjordHorseSnow.alt}
                  width={800}
                  height={1000}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 lg:min-h-full">
              <Image
                src={DESIGN_PHOTOS.fjordHorseRest.src}
                alt={DESIGN_PHOTOS.fjordHorseRest.alt}
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                {DESIGN_PHOTOS.mosaicHorses.map(photo => (
                  <div key={photo.src} className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center lg:text-left">
                <Button href="/archive">View all Posts</Button>
              </div>
            </div>
          </div>

          {hasPosts && (
            <div className="mt-20 border-t border-line pt-16">
              <div className="grid gap-12 md:grid-cols-2 lg:gap-14">
                {posts.slice(0, 2).map(post => (
                  <PostList
                    key={post._id}
                    post={post}
                    aspect="landscape"
                    preloadImage={true}
                  />
                ))}
              </div>
              <div className="mt-14 grid gap-12 md:grid-cols-2 xl:grid-cols-3">
                {posts.slice(2, 14).map(post => (
                  <PostList key={post._id} post={post} aspect="square" />
                ))}
              </div>
              <div className="mt-14 flex justify-center">
                <Link href="/archive" className="btn-pill">
                  View all Posts
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
