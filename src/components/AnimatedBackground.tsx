
export const AnimatedBackground = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute animate-blob top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      <div className="absolute animate-blob animation-delay-2000 top-[50%] left-[-10%] w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      <div className="absolute animate-blob animation-delay-4000 bottom-[-10%] right-[20%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
    </div>
  );
};

