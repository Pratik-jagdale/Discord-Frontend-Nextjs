/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        esmExternals: "loose",
    },
    output: 'standalone',
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
    webpack(config) {
        config.experiments = {
            asyncWebAssembly: true,
            syncWebAssembly: true,
            layers: true,
        };
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;