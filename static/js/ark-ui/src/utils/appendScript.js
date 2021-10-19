export const appendScript = (scripts) => {
    if (scripts) {
        const link = document.createElement('script')
        link.setAttribute('type', 'text/javascript')
        link.setAttribute('src', scripts)
        document.body.appendChild(link);
    }
};

export const appendAssest = (url) => {
    if (url) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', url)
        document.head.appendChild(link);
    }
};
