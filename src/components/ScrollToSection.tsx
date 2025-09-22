import React from "react";

const ScrollToSection = ({ sectionId }: { sectionId: string | null }) => {
  React.useEffect(() => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('hc-highlight-section');
        setTimeout(() => {
          el.classList.remove('hc-highlight-section');
        }, 2000);
      }
    }
  }, [sectionId]);
  return null;
};

export default ScrollToSection;
