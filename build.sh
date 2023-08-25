cd src
target=darwin npx electron-builder build --macos --arm64
target=darwin npx electron-builder build --macos --x64
target=win32 npx electron-builder build --win --x64