export default {
  name: "about",
  title: "About",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Page Title",
      type: "string"
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Tagline shown below the title"
    },
    {
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility."
        }
      ]
    },
    {
      name: "body",
      title: "Body",
      type: "blockContent"
    }
  ],
  preview: {
    select: {
      title: "title",
      media: "image"
    }
  }
};
