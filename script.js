const track = document.getElementById("image-track");

const initParticles = () => {
  const container = document.getElementById("particles-container");
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    container.appendChild(particle);
  }
};

initParticles();

const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);


const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  // Kinetic Background
  const titleBg = document.getElementById("title-bg");
  if (titleBg) {
    titleBg.animate(
      {
        transform: `translate(${-50 + percentage * 0.05}%, -50%)`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }

  // Update Progress Bar
  const progressFill = document.getElementById("progress-bar-fill");
  if (progressFill) {
    progressFill.style.width = `${Math.abs(percentage)}%`;
  }

  track.animate(


    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
};

/* -- Had to add extra lines for touch events -- */

window.onmousedown = (e) => handleOnDown(e);

window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);

window.ontouchend = (e) => handleOnUp(e.touches[0]);

const cursor = document.getElementById("custom-cursor");

window.onmousemove = (e) => {
  handleOnMove(e);
  
  cursor.animate(
    {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
    },
    { duration: 500, fill: "forwards" }
  );
};

// Cursor Hover Effects
document.querySelectorAll(".image-card").forEach((card) => {
  card.onmouseenter = () => {
    cursor.style.width = "60px";
    cursor.style.height = "60px";
    document.getElementById("cursor-text").style.opacity = "1";
  };
  
  card.onmouseleave = () => {
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    document.getElementById("cursor-text").style.opacity = "0";
  };
});


