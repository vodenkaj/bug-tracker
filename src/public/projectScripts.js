window.onload = () => {
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}/project-name`
    window.history.pushState({path:url}, "", url);
}
