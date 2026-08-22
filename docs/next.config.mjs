import nextra from "nextra";

const withNextra = nextra({
  search: {
    codeblocks: false,
  },
});

export default withNextra({
  agentRules: false,
  reactStrictMode: true,
});
