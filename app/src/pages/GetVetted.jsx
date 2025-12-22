import Sidebar from "../components/Sidebar";

export default function GetVetted() {
  return (
    <div className="h-screen flex" style={{ backgroundColor: "#fcfcfb" }}>
      <div className="flex w-full" style={{ height: "100vh" }}>
        <Sidebar activeItem="get-vetted" />
        <div className="flex-1 flex flex-col overflow-hidden px-6 py-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Get Vetted
              </h1>
              <p className="text-lg text-gray-600">
                Coming Soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

