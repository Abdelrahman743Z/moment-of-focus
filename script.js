// ملف script.js
document.addEventListener("DOMContentLoaded", function() {
    // عرض رسالة الترحيب لمدة 2.5 ثانية
    setTimeout(function() {
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'block';
    }, 2500); // 2.5 ثانية
});

function submitForm() {
    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;

    if (username && age) {
        // عرض رسالة النجاح
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';

        // حفظ بيانات المستخدم في localStorage (اختياري)
        localStorage.setItem('username', username);
        localStorage.setItem('age', age);

        // الانتظار لمدة ثانيتين ثم الانتقال للصفحة التالية
        setTimeout(function() {
            window.location.href = 'index2.html';
        }, 2000);
    } else {
        alert('يرجى ملء جميع الحقول');
    }
}