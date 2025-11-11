// Main JS: mobile nav toggle + simple scroll animations
document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(navToggle && mobileMenu){
    navToggle.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
  }

  // Simple intersection observer for .project-card and .project-card-like elements
  const els = document.querySelectorAll('.project-card, .project-card-like, .project-card');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.remove('opacity-0','translate-y-6');
          entry.target.classList.add('opacity-100','translate-y-0');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    els.forEach(el => {
      el.classList.add('opacity-0','translate-y-6','transition-all','duration-700');
      obs.observe(el);
    });
  } else {
    // fallback: reveal all
    els.forEach(el=> el.classList.remove('opacity-0','translate-y-6'));
  }
});
