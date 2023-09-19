/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/nawed2611/stemist-hacks",
        permanent: true,
      },
      {
        source: "/feedback",
        destination: "https://github.com/nawed2611/stemist-hacks/issues",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
