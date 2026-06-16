import { SignUp } from "@clerk/nextjs"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030014] text-white relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="z-10 shadow-2xl">
        <SignUp path="/register" routing="path" />
      </div>
    </div>
  )
}
