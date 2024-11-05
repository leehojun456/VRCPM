import {BrowserWindow, app, ipcMain, protocol} from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import * as fs from "node:fs";
// 현재 파일의 경로
const __filename = fileURLToPath(import.meta.url);
// 현재 파일의 디렉토리 경로
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
    });

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
}

const protocolName = "my-scheme-name"
protocol.registerSchemesAsPrivileged([{ scheme: protocolName, privileges: { bypassCSP: true}}])

app.whenReady().then(() => {
    createWindow();
    protocol.registerFileProtocol(protocolName, (request, callback)=> {
        const url = request.url.replace(`${protocolName}://`,"")
        try {
            return callback(decodeURIComponent(url))
        } catch (error)
        {
            console.error(error)
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 폴더 리스트를 가져오는 함수
function sendFolderList(event) {
    const picturesPath = app.getPath('pictures') + "/VRChat";
    fs.readdir(picturesPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            event.reply('folderList', { error: 'Failed to read directory' });
            return;
        }

        // 디렉토리 내에서 폴더만 필터링
        const folderList = files.filter(file => {
            const filePath = path.join(picturesPath, file);
            return fs.statSync(filePath).isDirectory();
        });

        // 폴더 리스트를 Renderer로 전송
        event.reply('folderList', folderList);
    });
}

// 'folderList' 요청을 받았을 때 폴더 리스트 전송
ipcMain.on('folderList', (event) => {
    sendFolderList(event);
});


// 'pictureList' 요청을 받았을 때 폴더 리스트 전송
ipcMain.on('pictureList', (event, timestamp) => {

    console.log(timestamp)

    const picturesPath = app.getPath('pictures') + "/VRChat/" + timestamp;
    fs.readdir(picturesPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            event.reply('folderList', { error: 'Failed to read directory' });
            return;
        }

        // 디렉토리 내 파일 중 이미지 파일만 가져오기 (예: .jpg, .png 확장자)
        const pictureList = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)).map(file => path.join(picturesPath, file));


        // 사진 리스트를 Renderer로 전송
        event.reply(`pictureList-${timestamp}`, pictureList);
    });
});