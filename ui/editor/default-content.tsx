const DEFAULT_EDITOR_CONTENT = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Introducing MindJournal" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Be the Main Character of Your Life Story. Generate a story from your memories and experiences.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Use `/` for commands and `++` for autocomplete.",
        },
      ],
    },
  ],
};

export default DEFAULT_EDITOR_CONTENT;
