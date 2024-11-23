import { BrowserWindow, app, ipcMain, protocol, shell } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
import sharp from 'sharp';
import ExifReader from 'exifreader';
import axios from "axios";


const headers =
    {
        maxRedirects: 0,
    headers: { "User-Agent": "VRCPM/0.0.2 hppmm@naver.com"}
}

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
            webSecurity: false,
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

// 'openRequest' 요청을 받았을 때 폴더 리스트 전송
ipcMain.on('openRequest',  async(event,timestamp) => {
    console.log("폴더 열기 요청을 받았습니다.")
    await shell.openPath(path.join(app.getPath('pictures'), "VRChat", timestamp))
});

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

ipcMain.on('requestMetadata', async (event, path) => {

    // 모델 설정
    let tags = {
        "player": null,
        "players": null,
        "world": {
            "id": null,
            "url": null,
            "thumb": null,
            "title": null,
            "authorName": null,
            "description": null,
        },
    };

    // 해당 주소의 파일을 읽어서 Exif 추출
    const exifData = ExifReader.load(fs.readFileSync(path));

    // description이 있는 경우 추가 정보 제공
    if (exifData.Description?.description) {
        const description = JSON.parse(exifData.Description.description);
        tags.world.id = description.world.id;
        tags.world.url = `https://vrchat.com/home/world/${description.world.id}`;
        tags.world.title = description.world.name;

        try {
            // VRChat API에서 추가 정보 가져오기
            const worldResponse = await axios.get(`https://api.vrchat.cloud/api/1/worlds/${description.world.id}`, headers);
            tags.world.title = worldResponse.data.name;

            // 썸네일 이미지 URL 가져오기 (리다이렉트 발생 시 처리)
            try {
                await axios.get(worldResponse.data.thumbnailImageUrl,  headers);
            } catch (thumbError) {
                if (thumbError.response && thumbError.response.status === 302) {
                    // 리다이렉트 URL 처리
                    tags.world.thumb = thumbError.response.headers.location;
                }
            }
        } catch (worldError) {
            console.error("World data fetch error:", worldError);
        }
    }
    else
    {
        tags = null;
    }

    // 모든 비동기 작업이 완료된 후에 응답을 전송
    console.log(tags);
    event.reply('responseMetadata', tags);
});
ipcMain.on('PictureResize', (event, path) => {

    fs.stat(path, (err, stats) => {
        if (stats.size > 8000000) {
            sharp(path)
                .resize(200, 200) // 200x200 사이즈로 리사이즈
                .toBuffer().then((data)=>{
                const base64Image = data.toString('base64');
                event.reply(`PictureResize-${path}`, `data:image/jpeg;base64,${base64Image}`);
            })
        }
        else
        {
            event.reply(`PictureResize-${path}`, `my-scheme-name:///${path}`);
        }
    })
});
