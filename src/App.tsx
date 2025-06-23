function App() {
  const handleGenerateRota = () => {
    window.open('https://docs.google.com/spreadsheets/d/test-sheet-id');
  };

  return (
    <div>
      <h1>Rotary</h1>
      <button onClick={handleGenerateRota}>Generate Rota</button>
    </div>
  )
}

export default App
