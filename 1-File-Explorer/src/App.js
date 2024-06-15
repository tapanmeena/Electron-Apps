import React, { useEffect, useState } from "react";
import "./App.css";
import { FilesViewer } from "./components/FileViewer";

function App() {
  const [directoryPath, setDirectoryPath] = useState("");
  const [files, setFiles] = useState([]);

  const listFiles = async () => {
    console.log("Listing files...");
    try {
      let dir = directoryPath.trim(); // Remove extra whitespace
      if (!dir) dir = getAppPath();
      const fileList = await window.electronAPI.listFiles(dir || null); // Pass null if dir is empty
      const sortedFiles = fileList.sort((a, b) => {
        if (a.directory && !b.directory) return -1;
        if (!a.directory && b.directory) return 1;
        return a.name.localeCompare(b.name);
      });
      setFiles(sortedFiles); // Update the state
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };

  useEffect(() => {
    listFiles();
  }, [directoryPath]);

  const getAppPath = async () => {
    try {
      const appPath = await window.electronAPI.getAppPath();
      setDirectoryPath(appPath);
    } catch (error) {
      console.error("Error getting app path:", error);
    }
  };

  const joinPath = async (...paths) => {
    const result = await window.electronAPI.joinPath(...paths);
    return result;
  };

  const onBack = async () => setDirectoryPath(await window.electronAPI.goBack(directoryPath));
  const onOpen = async (folder) => setDirectoryPath(await joinPath(directoryPath, folder));

  const [searchString, setSearchString] = useState("");
  const filteredFiles = files.filter((s) => s.name.includes(searchString));

  return (
    <div className="container mt-2">
      <h4>{directoryPath}</h4>
      <div className="form-group mt-4 mb-2">
        <input value={searchString} onChange={(event) => setSearchString(event.target.value)} className="form-control form-control-sm" placeholder="File search" />
      </div>
      <FilesViewer files={filteredFiles} onBack={onBack} onOpen={onOpen} />
    </div>
  );
}

export default App;
