import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // ده بيسمح بظهور صور المنتجات من أي سيرفر (زي Stripe أو لوحات رفع الصور)
      },
    ],
  },
  // لو فيه إعدادات تانية للمتجر تقدر تضيفها هنا
};

export default withNextIntl(nextConfig);