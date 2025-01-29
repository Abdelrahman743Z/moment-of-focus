function initDrawEffect() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return;
    }

    const ctx = canvas.getContext('2d');
    let points = [];
    let lastTime = 0;
    const SMOOTHING_FACTOR = 0.2;

    // تهيئة حجم الكانفاس
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function isInsideLoginContainer(x, y) {
        const loginContainer = document.querySelector('.login-container');
        if (!loginContainer || loginContainer.style.display === 'none') return false;

        const rect = loginContainer.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }

    function getCurvePoints(points) {
        const curvePoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(0, i - 1)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(points.length - 1, i + 2)];

            // Catmull-Rom إلى Bezier تحويل
            const cp1x = p1.x + (p2.x - p0.x) * SMOOTHING_FACTOR;
            const cp1y = p1.y + (p2.y - p0.y) * SMOOTHING_FACTOR;
            const cp2x = p2.x - (p3.x - p1.x) * SMOOTHING_FACTOR;
            const cp2y = p2.y - (p3.y - p1.y) * SMOOTHING_FACTOR;

            curvePoints.push({
                startPoint: p1,
                cp1: { x: cp1x, y: cp1y },
                cp2: { x: cp2x, y: cp2y },
                endPoint: p2
            });
        }
        return curvePoints;
    }

    function draw(e) {
        // تأكد من أن السياق موجود
        if (!ctx) return;

        const now = Date.now();
        if (now - lastTime < 16) return; // تحديد معدل التحديث
        lastTime = now;

        // لا نرسم إذا كان المؤشر داخل صندوق تسجيل الدخول
        if (isInsideLoginContainer(e.clientX, e.clientY)) {
            // نمنع إضافة نقاط جديدة داخل الصندوق
            return;
        }

        // إضافة النقطة الجديدة
        points.push({
            x: e.clientX,
            y: e.clientY,
            time: now
        });

        // مسح الخطوط القديمة
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (points.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const curvePoints = getCurvePoints(points);
            
            curvePoints.forEach((curve, i) => {
                if (i === 0) {
                    ctx.moveTo(curve.startPoint.x, curve.startPoint.y);
                }
                ctx.bezierCurveTo(
                    curve.cp1.x, curve.cp1.y,
                    curve.cp2.x, curve.cp2.y,
                    curve.endPoint.x, curve.endPoint.y
                );
            });
            
            ctx.stroke();
        }

        // حذف النقاط القديمة
        points = points.filter(point => now - point.time < 500);
    }

    // تهيئة الكانفاس
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // إضافة مستمع حركة الماوس
    document.addEventListener('mousemove', draw);

    // مسح النقاط عند مغادرة النافذة
    document.addEventListener('mouseout', () => {
        points = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// تشغيل التأثير عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDrawEffect);
} else {
    initDrawEffect();
}