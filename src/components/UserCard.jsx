import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="border rounded border-slate-200 shadow-xl w-80 p-4 ">
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
      <button
        onClick={() => navigate(`/description/${user.id}`)}
        className="bg-sky-600 text-white px-4 py-2 rounded block mx-auto mt-4 cursor-pointer hover:opacity-75"
      >
        Details
      </button>
    </div>
  );
};

export default UserCard;
