export default function RouteTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Admin V1 Routing Works!</h1>
        <p className="text-blue-700 mb-6">If you can see this, the routing is functioning correctly.</p>
        <a href="/admin/v1/login" className="text-blue-600 hover:underline">
          Go to Login
        </a>
      </div>
    </div>
  )
}
