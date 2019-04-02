function startHammerDrag() {
    var draged = {};
    document.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    document.addEventListener("dragstart", function (event) {
        console.log('dragstart', event.target);
        if (!event.target.trueTarget) {
            console.log('未绑定trueTaget', event.target);
            return false;
        }
        draged.current = event.target.trueTarget;//绑定真实被drag的元素
        draged.current.classList.add('dragging');
        event.target.trueTarget.container.isTarget = true; // 给trueTarget的 窗口（需要绑定）上色
    });

    document.addEventListener("dragenter", function (event) {
        if (event.target.container && event.target.container.isTarget === true)//这个时候就是进入tureTarget了
            event.target.classList.add('dragover');
    });
    document.addEventListener("dragleave", function (event) {
        if (event.target.container && event.target.container.isTarget === true)//这个时候就是进入tureTarget了
            event.target.classList.remove('dragover');
    });

    document.addEventListener("dragend", function (event) {
        event.preventDefault();
        // console.log('dragend,btn.event', event.target);
        draged.current.classList.remove('dragging');
        event.target.trueTarget.container.isTarget = false;
    });

    document.addEventListener("drop", function (event) {
        console.log('drop', event.target);
        event.preventDefault();
        //console.log('drop,last area', event.target, window.draged.current);
        if (event.target.container && event.target.container.isTarget === true) {
            event.target.classList.remove('dragover');
            draged.current.classList.remove('dragging');
            if (event.target.trueTarget.homeNode) {
                var dragedHome = draged.current.homeNode;
                var dropedHome = event.target.trueTarget.homeNode;
                dropedHome.insertBefore(draged.current, event.target.trueTarget);
                dragedHome.appendChild(event.target.trueTarget);
                event.target.trueTarget.homeNode = dragedHome;
                draged.current.homeNode = dropedHome;
            } else {
                if (draged.current.nextElementSibling === event.target.trueTarget) {
                    event.target.container.insertBefore(event.target.trueTarget, draged.current);
                } else {
                    event.target.container.insertBefore(draged.current, event.target.trueTarget);
                }

            }
            event.target.trueTarget.container.isTarget = false;
        }
    });
    console.log('开始 hammer drag');
}
startHammerDrag();