import "./App.css";
import Header from "./components/Header/Header.js";
import SearchBar from "./components/SearchBar/SearchBar.js";
import SearchResults from "./components/SearchResults/SearchResults.js";
import AppProvider from "./store/AppProvider.js";

function App() {
  return (
    <AppProvider>
      <div className="container">
        <Header />
        <SearchBar />
        <SearchResults />
      </div>
    </AppProvider>
  );
}

export default App;
