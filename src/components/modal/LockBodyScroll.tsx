function disable() {
    document.body.style.overflow = 'hidden';
}


function enable() {
    document.body.style.overflow = 'scroll';
}



export function disableScrolling() {
    disable();
}


export function enableScrolling() {
    enable();
}