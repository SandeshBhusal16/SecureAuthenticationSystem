import Routing from "./Route";

function App() {
  return (
    <>
      <div
        className="h-screen w-full flex justify-center items-center"
        style={{
          background:
            "linear-gradient(90deg, rgba(42, 123, 155, 1) 17%, rgba(69, 168, 142, 1) 42%, rgba(87, 199, 133, 1) 59%, rgba(237, 221, 83, 1) 91%)",
        }}
      >
        <Routing />
      </div>
    </>
  );
}

export default App;
