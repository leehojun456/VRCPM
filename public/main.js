import {BrowserWindow, app, ipcMain, protocol} from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import * as fs from "node:fs";
import sharp from "sharp";
// 현재 파일의 경로
const __filename = fileURLToPath(import.meta.url);
// 현재 파일의 디렉토리 경로
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
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
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('force-gpu-rasterization');
app.commandLine.appendSwitch('enabled_force');

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
ipcMain.on('pictureList',  (event, timestamp) => {
    console.log(timestamp);
    const picturesPath = path.join(app.getPath('pictures'), "VRChat", timestamp);
    fs.readdir(picturesPath, async (err, files) => {
        if (err) {
            console.error('디렉토리 읽기 오류:', err);
            event.reply('folderList', { error: '디렉토리 읽기 실패' });
            return;
        }

        // 이미지 파일만 필터링 (예: .jpg, .png 확장자)
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => path.join(picturesPath, file));

        event.reply(`pictureList-${timestamp}`, imageFiles);
    });
});

ipcMain.on('PictureResize', (event, path) => {
    console.log(path)
    sharp(path)
        .resize(200, 200) // 200x200 사이즈로 리사이즈
        .toBuffer().then((data)=>{
            const base64Image = data.toString('base64');
            console.log("리사이즈 완료")
            event.reply(`PictureResize-${path}`, `data:image/jpeg;base64,${base64Image}`);
    })
});
