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

    console.log(timestamp)

    const picturesPath = app.getPath('pictures') + "/VRChat/" + timestamp;
    fs.readdir(picturesPath, async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            event.reply('folderList', { error: 'Failed to read directory' });
            return;
        }

        // 디렉토리 내 파일 중 이미지 파일만 가져오기 (예: .jpg, .png 확장자)
        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)).map(file => path.join(picturesPath, file));

        const sentImages = new Set();

        for (const file of imageFiles) {
            if (sentImages.has(file)) {
                continue; // 이미 전송된 이미지면 건너뜀
            }
            try {
                // Read and process the image with Sharp
                const buffer = await sharp(file)
                    .resize({ width: 800 }) // Resize to width of 800px, adjust as needed
                    .jpeg({ quality: 80 }) // Convert to JPEG and set quality
                    .toBuffer();

                // Convert the buffer to Base64
                 const base64Image = buffer.toString('base64');
                // Store Base64 data in the array
                //pictureList.push(`data:image/jpeg;base64,${base64Image}`);

                await event.reply(`pictureList-${timestamp}`, `data:image/jpeg;base64,${base64Image}`);

            } catch (imageErr) {
                console.error('Error processing image:', imageErr);
            }
        }
    });
});