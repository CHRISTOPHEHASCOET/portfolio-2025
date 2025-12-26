const tl = gsap.timeline();

tl.from("h1", {
  opacity: 0,
  y: -30,
  duration: 1
})
.to(".plane", {
  opacity: 1,
  x: 40,
  duration: 1
});

document.querySelectorAll("td").forEach(td => {
  const text = td.dataset.text;
  td.textContent = "";

  [...text].forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.display = "inline-block";
    span.style.opacity = 0;
    td.appendChild(span);

    tl.to(span, {
      opacity: 1,
      y: [10, 0],
      duration: 0.05
    }, "+=0.02");
  });
});

tl.to(".plane", {
  y: 120,
  opacity: 0,
  duration: 1
})
.to(".plane", {
  x: 0,
  y: 0,
  opacity: 1,
  duration: 0.6
});
