import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // Allow LAN hostname access in dev so client JS hydrates (header buttons, etc.)
  allowedDevOrigins: ["192.169.13.81", "localhost"],
};

export default nextConfig;
