export function playMp3(Base64: string) {
    const sourceElement = document.createElement('source');
    sourceElement.setAttribute('src', `data:audio/mpeg;base64,${Base64}`);

    const audioElement = document.querySelector('audio#speech');

    if (audioElement) audioElement.appendChild(sourceElement);
}
