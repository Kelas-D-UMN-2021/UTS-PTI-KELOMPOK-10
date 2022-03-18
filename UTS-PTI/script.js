const Mahasiswa = (inName) => {
  let name = inName;
  let belajar = new Status("belajar", 0, 40, 0);
  let makan = new Status("makan", 500, 100, 20); 
  let main = new Status("main", 500, 60, 10);
  let tidur = new Status("tidur", 500, 20, 5);
  let semester = 1;

  const status = { belajar, makan, main, tidur };
  const perbarui = () => {
    belajar.perbarui();
    makan.perbarui();
    main.perbarui();
    tidur.perbarui();
  }

  return {
    name,
    semester,
    status,
    perbarui,
  }
};

class Status {
  isActive = false;
  constructor(name, amount, growth, shrink) {
    this.name = name;
    this.amount = amount;
    this.growth = growth;
    this.shrink = shrink;
    this.default = { growth: growth, shrink: shrink };
  }
  perbarui = () => {
    this.isActive ? this.amount += this.growth : this.amount -= this.shrink;
    this.amount = this.amount > 1000 ? 1000
      : this.amount = this.amount <= 0 ? 0
      : this.amount;
  }
  active = () => this.isActive = true;
  inactive = () => this.isActive = false;
  changeGrowth = (val) => { this.growth = val; }
  changeShrink = (val) => { this.shrink = val; }

  reset = () => {
    [this.growth, this.shrink] = [this.default.growth, this.default.shrink];
  }
};
  
const objectModel = (() => {
    const prosesBaru = (status, val) => {
      const element = document.querySelector(`#${status}-progressBar`);
      element.style.width = `${val}%`;
      element.innerText = `${val}%`;
    }
    
    const prosesSemester = (val) => {
      const element = document.querySelector("#semester-awal");
      element.innerText = val;
    }

    const perbaruiJam = ([hours, minutes]) => {
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      const jam = document.querySelector("#jam");
      jam.innerText = `${hours}:${minutes}`;
    }

    const button = (() => {
      let buttons = document.querySelectorAll(".togglebutton");
      buttons.forEach(button => {
        button.addEventListener("click", (e) => {
          permainan.toggle(e.target.dataset.name);
          button.classList.remove("btn-light");
          button.classList.add("btn-warning");
          buttons.forEach(button => {
            if (button != e.target) {
              button.classList.remove("btn-warning");
              button.classList.remove("active");
              button.classList.add("btn-light");
            }
          });
        });
      })
    })();
  
    const gantiNama = (name) => {;
      const element = document.querySelector("#nama-player");
      element.innerText = name;
    }
    return {
      prosesSemester,
      gantiNama,
      prosesBaru,
      perbaruiJam,
      button,
    }
    
})();
 
const permainan = (() => {
    let jam = new Date();
    let student = Mahasiswa("Student");
  
    const InitializeClock = () => {
      jam.setHours(7);
      jam.setMinutes(00);
    };
  
    const ubahWaktu = (hours, minutes) => {
      jam.setHours(hours);
      jam.setMinutes(minutes);
    };

    const perbaruiJam = () => {
      const [hours, minutes] = [jam.getHours(), jam.getMinutes()];
      objectModel.perbaruiJam([hours, minutes]);
      ubahWaktu(hours, minutes + 5);
    }

    const toggle = (status) => {
      student.status[status].isActive ?
      student.status[status].inactive() :
      student.status[status].active();
      Object.keys(playstudenter.status).forEach((obj) => {
        if (obj != status) {
          student.status[obj].inactive()
        }
      })
    }
    const Atur = (() => {
      let tambahMakan = true;
      return {
        semester: () => {
          if (student.status.belajar.amount >= 1000) {
            student.semester += 1;
            student.status["belajar"].amount = 0;
          }
          objectModel.prosesSemester(student.semester);
        },
        belajar: () => {
          if (student.status["belajar"].isActive) {
            student.status["makan"].changeShrink(30);
            student.status["main"].changeShrink(30);
          } 
          else {
            student.status["makan"].reset();
            student.status["main"].reset();
          }
        },
        tidur: () => {
          if (student.status["tidur"].amount < 200) {
            student.status["belajar"].changeGrowth(10);
            student.status["main"].changeShrink(30);
          }
          else {
            student.status["belajar"].reset();
            student.status["main"].reset();
          }
        },
        makan: () => {
          if (student.status["makan"].amount < 200) {
            student.status["belajar"].changeGrowth(20);
            student.status["main"].changeShrink(40);
          } 
          else {
            student.status["belajar"].reset();
            student.status["main"].reset();
          }
  
          if (student.status["makan"].amount === 1000 && tambahMakan) {
            student.status["main"].amount += 20;
            tambahMakan = false;
          }
          if(student.status["makan"].amount === 800) {
            tambahMakan = true;
          }
        },
        main: () => {
          if (student.status["main"].amount < 200) {
            student.status["belajar"].changeGrowth(20);
          }
          else if (student.status["main"].amount < 100) {
            student.status["belajar"].changeGrowth(10);
          } 
          else {
            student.status["belajar"].reset();
          }
        }
      }
    })();

    const jamPermainan = setInterval(() => {
      student.perbarui();
      perbaruiJam();
      Atur.semester();
      Atur.belajar();
      Atur.tidur();
      Atur.makan();
      Atur.main();
      Object.keys(student.status).forEach(val => {
        objectModel.prosesBaru(val, Math.round(student.status[val].amount / 10));
      })
    }, 1000);

    const Initialize = (() => {
      objectModel.gantiNama(student.name);
      objectModel.prosesSemester(student.semester);
      InitializeClock();
    })();

    return {
      Initialize,
      ubahWaktu,
      toggle,
      student,
    }
})();

const masalah = (() => {
      const waktu = (jam) => {
      switch(jam) {
          case "pagi":
            permainan.ubahWaktu(7, 00);
            break;
          case "siang":
            permainan.ubahWaktu(12, 00);
            break;
          case "sore":
            permainan.ubahWaktu(16, 00);
            break;
          case "malam":
            permainan.ubahWaktu(20, 00);
            break;
        }
      }
      const maxBelajar = () => {
        permainan.student.status["belajar"].amount = 1000;
      }
      return {
        waktu,
        maxBelajar,
      }
})();