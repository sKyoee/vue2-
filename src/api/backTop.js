export default function (node,scroll = 0){
    let height = 0
    let timer = setInterval(() => {
        if (node.scrollTop <= scroll) {
            node.scrollTop = scroll
            clearInterval(timer);
            return;
        } else {
            height += 6
            node.scrollTop -= height
        }
    }, 10);
}