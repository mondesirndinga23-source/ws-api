import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Description = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [retryCount, setRetryCount] = useState(0);
  const [result, setResult] = useState({
    requestKey: null,
    user: null,
    error: null,
  });
  const requestKey = `${id ?? ""}:${retryCount}`;
  const validId = /^[1-9]\d*$/.test(id ?? "");
  const loading = validId && result.requestKey !== requestKey;
  const user = result.requestKey === requestKey ? result.user : null;
  const error = validId
    ? result.requestKey === requestKey
      ? result.error
      : null
    : "Identifiant utilisateur invalide.";

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    if (!validId) return () => controller.abort();

    axios
      .get(`https://jsonplaceholder.typicode.com/users/${id}`, {
        signal: controller.signal,
      })
      .then((res) => {
        if (!active) return;
        if (!res.data?.id) {
          setResult({
            requestKey,
            user: null,
            error: "Utilisateur introuvable.",
          });
          return;
        }
        setResult({ requestKey, user: res.data, error: null });
      })
      .catch((requestError) => {
        if (!active || axios.isCancel(requestError)) return;

        if (requestError.response?.status === 404) {
          setResult({
            requestKey,
            user: null,
            error: "Utilisateur introuvable.",
          });
        } else {
          console.error("Unable to load user details:", requestError);
          setResult({
            requestKey,
            user: null,
            error:
              "Impossible de charger ce profil. Vérifiez votre connexion puis réessayez.",
          });
        }
      })

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, requestKey, validId]);

  if (loading) {
    return <p className="text-center">Chargement du profil...</p>;
  }

  if (error) {
    return (
      <div className="text-center text-red-700">
        <p>{error}</p>
        {validId && error !== "Utilisateur introuvable." && (
          <button
            onClick={() => setRetryCount((count) => count + 1)}
            className="bg-sky-600 text-white px-4 py-2 rounded mt-4 cursor-pointer hover:opacity-75"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  if (!user) {
    return <p className="text-center">Utilisateur introuvable.</p>;
  }

  return (
    <div className="border rounded border-slate-200 shadow-xl w-5/6 p-4 block mx-auto mt-4">
      <h3>
        <b>Name:</b>
        {user.name}
      </h3>
      <h3>
        <b>Email:</b>
        {user.email}
      </h3>
      <h3>
        <b>Phone:</b>
        {user.phone}
      </h3>
      <h3>
        <b>Address(street):</b>
        {user.address?.street}
      </h3>
      <h3>
        <b>City:</b>
        {user.address?.city}
      </h3>
      <h3>
        <b>Website:</b>
        {user.website}
      </h3>
      <button
        onClick={() => navigate("/")}
        className="bg-sky-600 text-white px-4 py-2 rounded block mx-auto mt-4 cursor-pointer hover:opacity-75"
      >
        Retour
      </button>
    </div>
  );
};

export default Description;
