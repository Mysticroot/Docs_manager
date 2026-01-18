# MLKit OCR Setup Instructions

The app uses `rn-mlkit-ocr` for text recognition from scanned documents. This is a native module that requires a custom development build.

## Current Status

✅ Code is updated to handle OCR gracefully  
✅ Development client dependencies installed  
✅ Native Android/iOS directories generated

## To Enable OCR Functionality:

### Option 1: Using EAS Build (Cloud Build - Recommended)

1. Install EAS CLI globally (if not already installed):

   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:

   ```bash
   eas login
   ```

3. Configure your project:

   ```bash
   eas build:configure
   ```

4. Build a development client for Android:

   ```bash
   eas build --profile development --platform android
   ```

5. Once the build completes, download and install the APK on your device

6. Start the dev server:
   ```bash
   npx expo start --dev-client
   ```

### Option 2: Local Build (Requires Android SDK)

1. Install Android Studio and Android SDK

2. Set up environment variables:

   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. Build and run:
   ```bash
   npx expo run:android
   ```

## Testing Without OCR

The app will work without a custom build, but OCR will be disabled. You'll see:

- "OCR not available - build with expo-dev-client" message after taking a photo
- All other features (camera, file upload, document management) work normally

## Verifying OCR Works

After installing the development build:

1. Open the app
2. Go to "Scan Document" tab
3. Take a photo of text
4. You should see the recognized text displayed below the image preview
