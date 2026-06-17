"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingHero() {
  const featuresRef = useRef(null);
  const downloadRef = useRef(null);
  const isFeatureInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const isDownloadInView = useInView(downloadRef, { once: true, amount: 0.3 });

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-gray-900"></div>
      </div>
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Phone Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className=" w-64 md:w-80 overflow-hidden rounded-3xl border border-gray-800 bg-black shadow-xl">
                <Image
                  src="/phonescreen.png?height=800&width=450"
                  alt="Kohedha App Screenshot"
                  width={450}
                  height={800}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
              Discover <span className="text-gray-400">Sri Lanka</span>{" "}
              through your fingertips
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-md">
              Find the best restaurants and events across Sri Lanka with
              personalized recommendations.
            </p>

            <div className=" w-64 md:w-80 overflow-hidden rounded-3xl bg-black shadow-xl">
              <Image
                src="/KO.png?height=800&width=450"
                alt="Kohedha App Screenshot"
                width={450}
                height={500}
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-wrap gap-4 mt-8 mb-12">
              <Button
                className="bg-white text-black hover:bg-gray-200"
                size="lg"
                asChild
              >
                <Link href="/events">Kohedha Events</Link>
              </Button>
              <Button
                className="bg-white text-black hover:bg-gray-200"
                size="lg"
                asChild
              >
                <Link href="/deals">Exclusive Deals</Link>
              </Button>
              <Button
                className="border-white bg-transparent hover:bg-white hover:text-black"
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("download")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Download Now
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="h-8 w-px bg-gray-800"></div>
              <div>
                <div className="text-2xl font-bold">4.9</div>
                <div className="text-sm text-gray-400">App Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 