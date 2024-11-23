import logo from './logo.svg';
import './App.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage.js";
import MainLayout from "./layouts/MainLayout.js";
import FolderPicture from "./components/FolderPicture.js";

function App() {
  return (
    <div className="App">
              <HashRouter>
                <Routes>
                    <Route element={<MainLayout></MainLayout>}>
                        <Route path={'/'} element={<MainPage></MainPage>}></Route>
                        <Route path={'/:timestamp'} element={<FolderPicture></FolderPicture>}></Route>
                        <Route path={'/info'} element={<MainPage></MainPage>}></Route>
                        <Route path={'/setting'} element={<MainPage></MainPage>}></Route>
                        <Route path={'/edit'} element={<MainPage></MainPage>}></Route>
                    </Route>
                </Routes>
              </HashRouter>
    </div>
  );
}

export default App;
