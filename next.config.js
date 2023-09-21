/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/nawed2611/mind-journal",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://github.com/nawed2611/mind-journal/issues",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
