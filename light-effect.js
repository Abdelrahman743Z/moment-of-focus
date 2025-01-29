// تهيئة تأثير الإضاءة
function initLightEffect() {
    let lastX = null;
    let lastY = null;
    let dots = [];

    function createDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'light-effect';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        document.body.appendChild(dot);
        
        // إضافة النقطة لمصفوفة النقاط
        dots.push({
            element: dot,
            createdAt: Date.now()
        });

        // إزالة النقاط القديمة
        const now = Date.now();
        dots = dots.filter(dot => {
            if (now - dot.createdAt > 500) {
                dot.element.remove();
                return false;
            }
            return true;
        });
    }

    function drawLine(x1, y1, x2, y2) {
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const points = Math.ceil(distance / 2); // نقطة كل 2 بكسل
        
        for (let i = 0; i <= points; i++) {
            const ratio = i / points;
            const x = x1 + (x2 - x1) * ratio;
            const y = y1 + (y2 - y1) * ratio;
            createDot(x, y);
        }
    }

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (lastX !== null && lastY !== null) {
            drawLine(lastX, lastY, x, y);
        }

        lastX = x;
        lastY = y;
    });

    document.addEventListener('mouseout', () => {
        lastX = null;
        lastY = null;
    });
}

// تشغيل التأثير عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initLightEffect); 