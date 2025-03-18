import "./App.css";

import Board from "./Board.tsx";

function App() {
  return (
    <>
      <Board height={9} width={9} difficulty="easy" />
    </>
  );
}

export default App;
