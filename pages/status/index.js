import useSWR from "swr";

async function fetchStatus(key) {
  const res = await fetch(key);
  const resbody = await res.json();
  return resbody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchStatus, {
    refreshInterval: 100,
    dedupingInterval: 100,
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>
            Last updated at: {new Date(data.updated_at).toLocaleString("pt-BR")}
          </p>
          <p>Version: {data.dependencies.database.version}</p>
          <p>Max connections: {data.dependencies.database.max_connections}</p>
          <p>Open connections: {data.dependencies.database.open_connections}</p>
        </>
      )}
    </div>
  );
}
