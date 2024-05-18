document.addEventListener("DOMContentLoaded", function () {
  // -[Animasi Scroll]---------------------------

  const navbarLinks = document.querySelectorAll(
    '.navbar a, footer a[href="#halamanku"]'
  );
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        const hash = this.hash;
        const targetElement = document.querySelector(hash);
        const targetTop = targetElement.offsetTop;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });

        window.location.hash = hash;
      }
    });
  });

  window.addEventListener("scroll", function () {
    const slideAnimations = document.querySelectorAll(".slideanim");
    slideAnimations.forEach((element) => {
      const elementTop = element.offsetTop;
      const windowTop = window.scrollY;

      if (elementTop < windowTop + 600) {
        element.classList.add("slide");
      }
    });
  });

  // -[Prediksi Model]---------------------------

  const cekButton = document.getElementById("cek_button");
  const submitButton = document.getElementById("submit_button");
  const formSoal = document.getElementById("form_soal");
  const predictionResultElement = document.getElementById('hasil_prediksi');
  const totalQuestions = 4; // Ganti dengan jumlah soal yang sesuai

  cekButton.addEventListener("click", function (event) {
    event.preventDefault();

    let totalVisual = 0;
    let totalAudio = 0;
    let totalKinestetik = 0;
    let allAnswered = true;

    for (let i = 1; i <= totalQuestions; i++) {
      const jawaban = document.querySelector(
        `input[name="jawaban${i}"]:checked`
      );

      if (jawaban) {
        if (jawaban.value === "a") {
          totalVisual++;
        } else if (jawaban.value === "b") {
          totalAudio++;
        } else if (jawaban.value === "c") {
          totalKinestetik++;
        }
      } else {
        allAnswered = false;
        break;
      }
    }

    if (allAnswered) {
      localStorage.setItem("totalVisual", totalVisual);
      localStorage.setItem("totalAudio", totalAudio);
      localStorage.setItem("totalKinestetik", totalKinestetik);
      submitButton.disabled = false;

      // Kirim permintaan AJAX ke endpoint API
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/deteksi");
      xhr.setRequestHeader("Content-Type", "application/json");

      const postData = JSON.stringify({
        totalVisual: totalVisual,
        totalAudio: totalAudio,
        totalKinestetik: totalKinestetik,
      });

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const predictionLabel = response["kelas_prediksi_label"];
          displayPrediction(predictionLabel);
        } else {
          console.error("Error:", xhr.statusText);
        }
      };

      xhr.onerror = function () {
        console.error("Network Error");
      };

      xhr.send(postData);
    } else {
      alert("Silakan jawab semua soal terlebih dahulu!");
    }
  });

  function displayPrediction(label) {
    const predictionHTML = `
            <h3>Hasil Prediksi</h3>
            <br>
            <h3>${label}</h3>
        `;
    predictionResultElement.innerHTML = predictionHTML;
  }
});
