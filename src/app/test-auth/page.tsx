// Test page to verify authentication
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TestAuthPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-800 to-accent-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Authentication Test Page
        </h1>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-semibold">✅ You are signed in!</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Session Data:</h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Name:</span> {session.user.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Role:</span>{" "}
                <span className={`font-bold ${session.user.role === "ADMIN" ? "text-red-600" : "text-blue-600"}`}>
                  {session.user.role}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">User ID:</span> {session.user.id}
              </p>
              {session.user.image && (
                <div className="mt-4">
                  <p className="text-sm font-semibold mb-2">Avatar:</p>
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
              )}
            </div>

            {session.user.role === "ADMIN" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">
                  🎉 You have ADMIN access! (First user gets ADMIN role)
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Full Session Object:</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
