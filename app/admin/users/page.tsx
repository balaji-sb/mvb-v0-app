import UsersTable from "@/components/admin/users-table"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">Manage registered customers</p>
      </div>
      <UsersTable />
    </div>
  )
}
