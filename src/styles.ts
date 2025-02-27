export const cameraStyles = `
.vlicCamera {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1000;
}

.camera-centered {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.front-back {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 50%;
}

.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
`

// Helper function to inject styles
export function injectCameraStyles() {
    if (!document.getElementById('camera-styles')) {
        const styleSheet = document.createElement('style')
        styleSheet.id = 'camera-styles'
        styleSheet.textContent = cameraStyles
        document.head.appendChild(styleSheet)
    }
} 