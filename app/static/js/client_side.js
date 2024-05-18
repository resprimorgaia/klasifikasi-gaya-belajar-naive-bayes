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
  const formSoal = document.getElementById("form_soal");
  const predictionResultElement = document.getElementById("hasil_prediksi");
  const downloadPDF = document.getElementById("download_button");
  const totalQuestions = 22; // Ganti dengan jumlah soal yang sesuai

  // Sembunyikan formulir soal saat halaman dimuat
  formSoal.style.display = "none";

  // Event handler saat tombol "Submit" pada formulir data diklik
  document
    .getElementById("nameSubmitButton")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Hindari pengiriman formulir yang standar
      var name = document.getElementById("name").value;
      var Kelas = document.getElementById("class").value;
      var Sekolah = document.getElementById("school").value;

      // Validasi jika semua input diisi
      if (name.trim() !== "" && Kelas.trim() !== "" && Sekolah.trim() !== "") {
        document.getElementById("data").style.display = "none"; // Sembunyikan formulir input data
        formSoal.style.display = "block"; // Tampilkan formulir soal
      }
    });

  cekButton.addEventListener("click", function (event) {
    event.preventDefault();
    handlePrediction();
  });

  function handlePrediction() {
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
      const counts = {
        visual: totalVisual,
        audio: totalAudio,
        kinestetik: totalKinestetik,
      };

      const values = Object.values(counts);
      const maxCount = Math.max(...values);
      const hasDuplicates =
        values.filter((value) => value === maxCount).length > 1;

      if (hasDuplicates) {
        if (counts.visual === maxCount && counts.audio === maxCount) {
          document.getElementById("tipe_1").style.display = "block";
        } else if (
          counts.visual === maxCount &&
          counts.kinestetik === maxCount
        ) {
          document.getElementById("tipe_2").style.display = "block";
        } else if (
          counts.audio === maxCount &&
          counts.kinestetik === maxCount
        ) {
          document.getElementById("tipe_3").style.display = "block";
        }

        cekButton.innerText = "Deteksi Ulang";
        cekButton.removeEventListener("click", handlePrediction);
        cekButton.addEventListener("click", handleAdditionalPrediction);
        return;
      }

      sendPredictionRequest(totalVisual, totalAudio, totalKinestetik);
    } else {
      alert("Silakan jawab semua soal terlebih dahulu!");
    }
  }

  function handleAdditionalPrediction() {
    let totalVisual = 0;
    let totalAudio = 0;
    let totalKinestetik = 0;

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
      }
    }

    const additionalQuestions = document.querySelectorAll(
      "#soal_tambahan input:checked"
    );
    additionalQuestions.forEach((jawaban) => {
      if (jawaban.value === "a") {
        totalVisual++;
      } else if (jawaban.value === "b") {
        totalAudio++;
      } else if (jawaban.value === "c") {
        totalKinestetik++;
      }
    });

    sendPredictionRequest(totalVisual, totalAudio, totalKinestetik);
  }

  function sendPredictionRequest(totalVisual, totalAudio, totalKinestetik) {
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
        const additionalParagraph = response["additional_paragraph"];
        displayPrediction(predictionLabel, additionalParagraph);
    } else {
        console.error("Error:", xhr.statusText);
      }
    };

    xhr.onerror = function () {
      console.error("Network Error");
    };

    xhr.send(postData);
  }

  // Sembunyikan formulir soal saat halaman dimuat
  formSoal.style.display = "none";

  // Variabel untuk menyimpan nilai nama, kelas, dan sekolah
  let nameValue = "";
  let kelasValue = "";
  let sekolahValue = "";

  // Event handler saat tombol "Submit" pada formulir data diklik
  document
    .getElementById("nameSubmitButton")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Hindari pengiriman formulir yang standar
      nameValue = document.getElementById("name").value;
      kelasValue = document.getElementById("class").value;
      sekolahValue = document.getElementById("school").value;

      // Validasi jika semua input diisi
      if (
        nameValue.trim() !== "" &&
        kelasValue.trim() !== "" &&
        sekolahValue.trim() !== ""
      ) {
        document.getElementById("data").style.display = "none"; // Sembunyikan formulir input data
        formSoal.style.display = "block"; // Tampilkan formulir soal
      }
    });
    

    function displayPrediction(predictionLabel, additionalParagraph) {
    const predictionHTML = `
    <b><h3>Hasil Prediksi</h3></b>
    <p>Nama: ${nameValue}</p>
    <p>Kelas: ${kelasValue}</p>
    <p>Sekolah: ${sekolahValue}</p>
    <br>
    <h3>${predictionLabel}</h3>
    <p>${additionalParagraph}</p>
    `;
   

    predictionResultElement.innerHTML = predictionHTML;

    // Reset cek button to original state
    cekButton.innerText = "Cek";
    cekButton.removeEventListener("click", handleAdditionalPrediction);
    cekButton.addEventListener("click", handlePrediction);

    // Hide additional questions
    document.getElementById("tipe_1").style.display = "none";
    document.getElementById("tipe_2").style.display = "none";
    document.getElementById("tipe_3").style.display = "none";
  }
 
});
