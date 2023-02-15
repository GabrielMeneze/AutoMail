export default function CopyButton(email: string | undefined) {
    if (!email) {
        return;
    }
    const el = document.createElement('textarea');
    el.value = email;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}