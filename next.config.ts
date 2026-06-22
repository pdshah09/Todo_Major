import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins :[
    '127.0.0.1',
    '192.168.1.10',
    '192.168.1.2'
  ]
};

export default nextConfig;
