// import Sidebar from "../components/Sidebar.jsx";

import { useGetUsersForSidebarQuery } from "../Store/Slice/messageSlice.js";

const HomePage = () => {
  const { data: users, error, isLoading } = useGetUsersForSidebarQuery();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* <Sidebar /> */}

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore molestias maxime iure nisi aperiam, accusantium repellat ipsam facilis deleniti, voluptates mollitia numquam sequi reiciendis doloremque consectetur nemo praesentium quia. Officia.
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
