const track = document.getElementById("image-track");

const initParticles = () => {
  const container = document.getElementById("particles-container");
  const colors = ["#8b5cf6", "#3b82f6", "#ffffff"];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.setProperty("--duration", `${Math.random() * 10 + 10}s`);
    particle.style.setProperty("--opacity", `${Math.random() * 0.4 + 0.1}`);
    container.appendChild(particle);
  }
};

initParticles();

const handleOnDown = (e) => (track.dataset.mouseDownAt = e.clientX);


const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
  
  // Reset Liquid Scale
  const displacementMap = document.querySelector("feDisplacementMap");
  if (displacementMap) {
    displacementMap.setAttribute("scale", "0");
  }
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

  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.onclick = (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newPercentage = (clickX / rect.width) * -100;
      track.dataset.prevPercentage = newPercentage;
      track.dataset.percentage = newPercentage;
      
      track.animate({
        transform: `translate(${newPercentage}%, -50%)`
      }, { duration: 1200, fill: "forwards" });
    };
  }

  // Liquid Distortion
  const displacementMap = document.querySelector("feDisplacementMap");
  if (displacementMap) {
    const warpScale = Math.min(Math.abs(mouseDelta * 0.1), 50);
    displacementMap.setAttribute("scale", warpScale);
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

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.onclick = () => {
    document.body.classList.toggle("light-mode");
  };
}

window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);

window.ontouchend = (e) => handleOnUp(e.touches[0]);

const cursor = document.getElementById("custom-cursor");
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

window.onmousemove = (e) => {
  handleOnMove(e);
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // 3D Track Tilt
  const xOffset = (e.clientX / window.innerWidth - 0.5) * 10;
  const yOffset = (e.clientY / window.innerHeight - 0.5) * 10;
  track.animate({
    transform: `translate(${track.dataset.percentage || 0}%, -50%) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`
  }, { duration: 1200, fill: "forwards" });

  // Title Warp
  const titleBg = document.getElementById("title-bg");
  if (titleBg) {
    const tx = (e.clientX / window.innerWidth - 0.5) * 50;
    const ty = (e.clientY / window.innerHeight - 0.5) * 50;
    titleBg.animate({
      transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`
    }, { duration: 2000, fill: "forwards" });
  }
};

const animateCursor = () => {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
  
  requestAnimationFrame(animateCursor);
};

animateCursor();

window.ontouchmove = (e) => handleOnMove(e.touches[0]);

// Cursor Hover Effects
document.querySelectorAll(".image-card").forEach((card) => {
  card.onmouseenter = () => {
    cursor.style.width = "80px";
    cursor.style.height = "80px";
    cursor.style.backgroundColor = "white";
    document.getElementById("cursor-text").style.opacity = "1";
  };
  
  card.onmousemove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    card.animate({
      transform: `rotateX(${-y / 10}deg) rotateY(${x / 10}deg) scale(1.05) translate(${x / 20}px, ${y / 20}px)`
    }, { duration: 400, fill: "forwards" });
  };
  
  card.onmouseleave = () => {
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    document.getElementById("cursor-text").style.opacity = "0";
    
    card.animate({
      transform: `rotateX(0deg) rotateY(0deg) scale(1) translate(0px, 0px)`
    }, { duration: 400, fill: "forwards" });
  };
});
