import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-800">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-dark-700 border border-white/10",
          },
        }}
      />
    </div>
  );
}
