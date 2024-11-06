const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('folderList', {
    request: () => ipcRenderer.send('folderList'),
    onReceiveList: (callback) => ipcRenderer.on('folderList', (event, list) => callback(list)),
});

contextBridge.exposeInMainWorld('PictureList', {
    requestPicture: (timestamp) =>  ipcRenderer.send('pictureList', timestamp),
    onReceiveList: (timestamp,callback) => {
        const channel = `pictureList-${timestamp}`;
        const listener = (event, list) => callback(list);
        ipcRenderer.on(channel, listener);

        // Return a function to remove the listener
        return () => ipcRenderer.removeListener(channel, listener);
    },
});