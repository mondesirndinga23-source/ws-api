import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const UserList = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({
    requestKey: null,
    users: [],
    error: null,
  });
  const loading = result.requestKey !== retryCount;
  const users = loading ? [] : result.users;
  const error = loading ? null : result.error;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    axios
      .get("https://jsonplaceholder.typicode.com/users", {
        signal: controller.signal,
      })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("Invalid users response");
        }
        if (active) {
          setResult({
            requestKey: retryCount,
            users: res.data,
            error: null,
          });
        }
      })
      .catch((requestError) => {
        if (!active || axios.isCancel(requestError)) return;
        console.error("Unable to load users:", requestError);
        setResult({
          requestKey: retryCount,
          users: [],
          error:
            "Impossible de charger les utilisateurs. Vérifiez votre connexion puis réessayez.",
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [retryCount]);

  if (loading) {
    return <p className="text-center">Chargement des utilisateurs...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-700">
        <p>{error}</p>
        <button
          onClick={() => setRetryCount((count) => count + 1)}
          className="bg-sky-600 text-white px-4 py-2 rounded mt-4 cursor-pointer hover:opacity-75"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
