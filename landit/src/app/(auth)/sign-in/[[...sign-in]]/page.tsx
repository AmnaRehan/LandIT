'use client';
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="relative min-h-screen w-full
      bg-gradient-to-b from-purple-700 via-purple-200 to-white
      dark:from-purple-800 dark:via-purple-700 dark:to-black
      transition-colors duration-300"
    >
      
      <main className="relative flex items-center justify-center px-4 py-12 -mt-6">
        <SignIn
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

export default SignInPage;