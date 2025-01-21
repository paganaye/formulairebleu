export function ensureBootstrapLoaded(): void {

    function isBootstrapCssLoaded(): boolean {
        const testElement = document.createElement('div');
        testElement.className = 'container';
        document.body.appendChild(testElement);
        const isLoaded = window.getComputedStyle(testElement).marginLeft !== '0px';
        document.body.removeChild(testElement); // Nettoyage
        return isLoaded;
    }

    function isBootstrapJsLoaded(): boolean {
        return typeof (window as any).bootstrap !== 'undefined';
    }
    if (!isBootstrapCssLoaded()) {
        const link = document.createElement('link');
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
        link.rel = "stylesheet";
        link.integrity = "sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH";
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
    }
    if (!isBootstrapJsLoaded()) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
        script.integrity = "sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz";
        script.crossOrigin = "anonymous";
        script.defer = true;
        document.body.appendChild(script);
    }

    console.log("Bootstrap loaded");
}


