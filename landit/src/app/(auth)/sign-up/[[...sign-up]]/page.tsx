'use client';

import { SignUp } from "@clerk/nextjs";
import { ThemeToggle } from "../../../../components/content/ThemeToggle"; 

const SignUpPage = () => {
  return (
    <div className="relative min-h-screen w-full
      bg-gradient-to-b from-purple-700 via-purple-200 to-white
      dark:from-purple-900 dark:via-purple-700 dark:to-black
      transition-colors duration-300"
    >
     
      <main className="relative flex items-center justify-center px-4 py-12 -mt-6">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-2xl backdrop-blur-sm"
            }
          }}
        />
      </main>
    </div>
  );
};

export default SignUpPage;
