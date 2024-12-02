import React from "react";
import { Cover } from "@/components/ui/cover";
import {FeaturesSectionDemo} from "./FeaturesPreview";
export function CoverDemo() {
  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-green-800 via-green-600 to-green-500 dark:from-green-700 dark:via-green-400 dark:to-green-300">
        Welcome to the <br /> 
        <Cover>Sathyabama Canteen</Cover> <br /> 
        Online Payment Portal
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl max-w-5xl mx-auto text-center mt-4 text-neutral-700 dark:text-neutral-300">
        Experience seamless and secure transactions at your fingertips.
      </p>
      <FeaturesSectionDemo/>
      
       {/* Credits Section */}
       <footer className="text-center p-4 mt-25">
        <div className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg">
          <p className="font-semibold">Developed by <span className="text-green-700 dark:text-green-400">Akshay Esackimuthu</span></p>
          {/* <p className="font-semibold">Idea and brainstormed by <span className="text-green-700 dark:text-green-400">Alfred Mathew</span></p> */}
        </div>
      </footer>
    </div>
  );
}
