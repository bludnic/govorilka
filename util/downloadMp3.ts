export function downloadMp3(
    Base64: string,
    filename: string = Date.now().toString()
) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:audio/mpeg;base64,${Base64}`);
    element.setAttribute('download', `${filename}.mp3`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
