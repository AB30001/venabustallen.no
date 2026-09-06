import Container from "@/components/container";
import { getAboutImage } from "@/lib/local-images";
import { PortableText } from "@/lib/sanity/plugins/portabletext";
import Image from "next/image";
import Button from "@/components/ui/button";

export default function About({ about }) {
  const imageProps = about ? getAboutImage() : null;

  return (
    <Container>
      <div className="mx-auto max-w-screen-md text-center">
        <div className="rule mb-8" />
        <h1 className="heading-display">
          {about?.title || "About"}
        </h1>
        {about?.subtitle && (
          <p className="mt-4 font-serif text-lg italic text-muted md:text-xl">
            {about.subtitle}
          </p>
        )}
      </div>

      {imageProps && (
        <div className="relative mx-auto mt-12 aspect-[16/9] max-w-screen-md overflow-hidden">
          <Image
            src={imageProps.src}
            alt={about?.image?.alt || about?.title || "About"}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            placeholder={about?.image?.blurDataURL ? "blur" : "empty"}
            blurDataURL={about?.image?.blurDataURL}
          />
        </div>
      )}

      {about?.body && (
        <div className="prose-venabu mx-auto mt-12 max-w-screen-md">
          <PortableText value={about.body} />
        </div>
      )}

      {!about && (
        <div className="mx-auto mt-12 max-w-screen-md text-center text-muted">
          <p>No content yet — add it in the Sanity Studio.</p>
        </div>
      )}

      <div className="mx-auto mt-12 max-w-screen-md text-center">
        <Button href="/contact">Ta kontakt</Button>
      </div>
    </Container>
  );
}
